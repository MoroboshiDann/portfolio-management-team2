const express = require('express');
const router = express.Router();
const db = require('../db');
const { getStockPriceByDate } = require('../../src/utils/handleStockUtil');

// Function to get stock code from company name
const getStockCode = async (companyName) => {
  try {
    console.log(`Looking up stock code for company: ${companyName}`);
    
    // 首先尝试直接匹配公司名称
    let query = `SELECT stock_code FROM company_code WHERE name = ?`;
    let [result] = await db.query(query, [companyName]);
    
    // 如果没有找到，尝试匹配stock_code
    if (result.length === 0) {
      console.log(`No match found for company name: ${companyName}, trying stock_code match`);
      query = `SELECT stock_code FROM company_code WHERE stock_code = ?`;
      [result] = await db.query(query, [companyName.toLowerCase()]);
    }
    
    console.log(`Query result for ${companyName}:`, result);
    
    if (result.length > 0) {
      console.log(`Found stock code: ${result[0].stock_code} for company: ${companyName}`);
      return result[0].stock_code;
    } else {
      console.log(`No stock code found for company: ${companyName}`);
      return null;
    }
  } catch (error) {
    console.error('Error getting stock code:', error);
    return null;
  }
};

// Function to generate virtual price for non-stock assets
const generateVirtualPrice = (assetType) => {
  const basePrices = {
    'mutual funds': 50,
    'gold': 2000,
    'fixed deposite': 100,
    'real estate': 500000,
    'bonds': 100
  };
  
  const basePrice = basePrices[assetType] || 100;
  // Generate a random price within ±10% of base price
  const variation = (Math.random() - 0.5) * 0.2; // ±10%
  const virtualPrice = basePrice * (1 + variation);
  console.log(`Generated virtual price for ${assetType}: $${virtualPrice.toFixed(2)}`);
  return virtualPrice;
};

// Function to get price for any asset type
const getAssetPrice = async (assetType, companyName, date) => {
  console.log(`Getting asset price for: ${assetType}, company: ${companyName}, date: ${date}`);
  
  if (assetType === 'stocks') {
    // 清理公司名称，移除可能的标签文本
    let cleanCompanyName = companyName.replace(/\s*\([^)]*\)\s*$/, '').trim();
    console.log(`Cleaned company name: ${cleanCompanyName}`);
    
    // 检查是否是有效的股票代码（大写字母）
    let stockCode = cleanCompanyName;
    
    // 如果清理后的名称不是全大写（可能是公司名称），则查询stock code
    if (cleanCompanyName !== cleanCompanyName.toUpperCase()) {
      console.log(`Asset type is stock, looking up stock code for: ${cleanCompanyName}`);
      stockCode = await getStockCode(cleanCompanyName);
      
      if (!stockCode) {
        console.log(`Stock code not found for company: ${cleanCompanyName}`);
        throw new Error(`Stock code not found for company: ${cleanCompanyName}. Please check if the company name is correct and exists in our database.`);
      }
    }
    
    console.log(`Using stock code: ${stockCode} to fetch price for date: ${date}`);
    try {
      const stockData = await getStockPriceByDate(stockCode, date);
      console.log(`Stock data received:`, stockData);
      
      if (stockData.length > 0) {
        const price = stockData[0].price;
        console.log(`Successfully got stock price: $${price} for ${stockCode} on ${date}`);
        return price;
      } else {
        console.log(`No stock data found for ${stockCode} on ${date}`);
        throw new Error(`No stock data found for ${stockCode} on ${date}. Please try a different date.`);
      }
    } catch (error) {
      console.error('Error fetching stock price:', error);
      throw new Error(`Failed to fetch stock price for ${cleanCompanyName} (${stockCode}) on ${date}: ${error.message}`);
    }
  } else {
    // Generate virtual price for non-stock assets
    console.log(`Asset type is ${assetType}, generating virtual price`);
    return generateVirtualPrice(assetType);
  }
};

// POST endpoint to save enhanced transaction data
router.post('/', async (req, res) => {
  try {
    console.log('Enhanced transaction request body:', req.body);
    const { transactionType, type, amount, name, date, quantity } = req.body;

    // Validate required fields
    if (!transactionType || !name || !date || !type) {
      return res.status(400).json({
        error: 'Missing required fields: transactionType, name, date, and type are required'
      });
    }

    // Validate that either amount or quantity is provided
    if (amount === undefined && quantity === undefined) {
      return res.status(400).json({
        error: 'Either amount or quantity must be provided'
      });
    }

    // Get asset price
    let price;
    try {
      price = await getAssetPrice(type, name, date);
    } catch (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    // Calculate missing field (amount or quantity)
    let finalAmount, finalQuantity;
    if (amount !== undefined && quantity === undefined) {
      finalAmount = parseFloat(amount);
      finalQuantity = finalAmount / price;
    } else if (quantity !== undefined && amount === undefined) {
      finalQuantity = parseFloat(quantity);
      finalAmount = finalQuantity * price;
    } else {
      // Both provided, use the provided values
      finalAmount = parseFloat(amount);
      finalQuantity = parseFloat(quantity);
    }

    // Clean company name (remove [CompanyName] suffix if present)
    const cleanCompanyName = name.replace(/\[CompanyName\]$/, '');

    // Get portfolio record
    const findPortfolioRecord = `
      SELECT * 
      FROM portfolio
      WHERE type = ? AND name = ?
    `;
    const [portfolioRecord] = await db.query(findPortfolioRecord, [type, cleanCompanyName]);
    const recordAmount = portfolioRecord[0] == null ? 0 : parseFloat(portfolioRecord[0].amount);
    const recordQuantity = portfolioRecord[0] == null ? 0 : parseFloat(portfolioRecord[0].quantity);

    // Handle sell transactions
    if (transactionType === 'sell') {
      if (portfolioRecord[0] == null) {
        return res.status(400).json({
          error: 'No asset found to sell'
        });
      }
      if (recordQuantity < finalQuantity) {
        return res.status(400).json({
          error: 'Not enough quantity to sell'
        });
      }
      // Make amount negative for sell transactions
      finalAmount = -Math.abs(finalAmount);
      finalQuantity = -Math.abs(finalQuantity);
    }

    // Insert or update portfolio record
    if (portfolioRecord[0] == null) {
      // Create new portfolio record
      const newRecord = `
        INSERT INTO portfolio (type, amount, name, quantity, date)
        VALUES (?, ?, ?, ?, ?)
      `;
      const result = await db.query(newRecord, [type, finalAmount, cleanCompanyName, finalQuantity, date]);
      
      // Insert transaction record
      const insertTransaction = `
        INSERT INTO transaction (amount, name, tran_date)
        VALUES (?, ?, ?)
      `;
      await db.query(insertTransaction, [finalAmount, cleanCompanyName, date]);
      
      return res.status(201).json({
        id: result[0].insertId,
        message: 'Transaction saved successfully',
        data: { 
          type: type, 
          amount: finalAmount, 
          name: cleanCompanyName, 
          quantity: finalQuantity,
          date: date,
          price: price
        }
      });
    } else {
      // Update existing portfolio record
      const updateRecord = `
        UPDATE portfolio
        SET amount = amount + ?, quantity = quantity + ?
        WHERE type = ? AND name = ?
      `;
      const result = await db.query(updateRecord, [finalAmount, finalQuantity, type, cleanCompanyName]);

      // Insert transaction record
      const insertTransaction = `
        INSERT INTO transaction (amount, name, tran_date)
        VALUES (?, ?, ?)
      `;
      await db.query(insertTransaction, [finalAmount, cleanCompanyName, date]);

      res.status(201).json({
        id: result[0].insertId,
        message: 'Transaction saved successfully',
        data: { 
          type: type, 
          amount: finalAmount, 
          name: cleanCompanyName, 
          quantity: finalQuantity,
          date: date,
          price: price
        }
      });
    }

  } catch (error) {
    console.error('Error saving enhanced transaction:', error);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

// GET endpoint to get asset price (for frontend calculations)
router.get('/price', async (req, res) => {
  try {
    const { asset, companyName, date } = req.query;
    
    if (!asset || !companyName || !date) {
      return res.status(400).json({
        error: 'Missing required parameters: asset, companyName, and date are required'
      });
    }

    const price = await getAssetPrice(asset, companyName, date);
    
    res.json({
      price: price,
      asset: asset,
      companyName: companyName,
      date: date
    });

  } catch (error) {
    console.error('Error getting asset price:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 