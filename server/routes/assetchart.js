const express = require('express');
const router = express.Router();
const db = require('../db');
const { getLatestStockPrice, generateRandomPrice } = require('../../src/utils/handleStockUtil');

// Function to get stock code from company name (copied from enhanced_trans_form.js)
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

// Function to get asset price (copied from enhanced_trans_form.js)
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
      const stockData = await getLatestStockPrice(stockCode);
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
    // Generate random price for non-stock assets
    console.log(`Asset type is ${assetType}, generating random price`);
    return generateRandomPrice(assetType, companyName);
  }
};

// Get aggregated asset allocation data
router.get('/asset-allocation', async (req, res) => {
  try {
    // SQL query to sum amounts grouped by asset type
    const query = `
      SELECT 
        type,
        amount
      FROM portfolio`;
    
    const [results] = await db.query(query);
    console.log("Asset allocation data retrieved successfully");
    
    // Format data for Chart.js
    const labels = results.map(row => {
      // Capitalize first letter of asset type
      return row.type.charAt(0).toUpperCase() + row.type.slice(1);
    });
    
    const values = results.map(row => row.amount);
    console.log("Asset values:", values);
    
    res.json({ 
      labels,
      values 
    });
  } catch (error) {
    console.error('Error fetching asset allocation data:', error);
    res.status(500).json({ error: 'Failed to fetch asset allocation data' });
  }
});

// Get detailed records for specific asset type with profit rate calculation
router.get('/asset-records', async (req, res) => {
  try {
    const { type } = req.query;
    
    if (!type) {
      return res.status(400).json({ error: 'Missing asset type parameter' });
    }

    const query = `
      SELECT 
        id,
        type,
        name,
        amount,
        quantity,
        date
      FROM portfolio
      WHERE type = ?
      ORDER BY date DESC`;
    
    const [results] = await db.query(query, [type.toLowerCase()]);
    console.log(`Retrieved ${results.length} records for asset type: ${type}`);
    console.log('Raw portfolio data:', results);
    
    // Calculate profit rate for all asset types
    const recordsWithProfitRate = await Promise.all(
      results.map(async (record) => {
        try {
          console.log(`\nProcessing record: ${record.name} (${record.type})`);
          console.log(`Record data:`, record);
          
          let currentPrice = null;
          let profitRate = null;
          
          // Use the same approach as enhanced_trans_form.js
          try {
            currentPrice = await getAssetPrice(record.type, record.name, record.date);
            console.log(`Got price for ${record.name}: $${currentPrice}`);
          } catch (priceError) {
            console.error(`Failed to get price for ${record.name}:`, priceError.message);
            currentPrice = null;
          }
          
          // Calculate profit rate if we have price and valid quantity/amount
          if (currentPrice && record.quantity && record.amount) {
            const currentValue = record.quantity * currentPrice;
            profitRate = ((currentValue - record.amount) / record.amount) * 100;
            
            console.log(`Profit rate calculation for ${record.name}:`);
            console.log(`  Quantity: ${record.quantity}`);
            console.log(`  Current Price: $${currentPrice}`);
            console.log(`  Current Value: $${currentValue}`);
            console.log(`  Purchase Amount: $${record.amount}`);
            console.log(`  Profit Rate: ${profitRate.toFixed(2)}%`);
          } else {
            console.log(`Cannot calculate profit rate for ${record.name}:`);
            console.log(`  currentPrice:`, currentPrice);
            console.log(`  quantity:`, record.quantity);
            console.log(`  amount:`, record.amount);
          }
          
          return {
            ...record,
            profitRate: profitRate !== null ? parseFloat(profitRate.toFixed(2)) : null,
            currentPrice: currentPrice
          };
        } catch (error) {
          console.error(`Error calculating profit rate for ${record.name}:`, error);
          return {
            ...record,
            profitRate: null,
            currentPrice: null
          };
        }
      })
    );
    
    console.log('Final records with profit rates:', recordsWithProfitRate);
    res.json(recordsWithProfitRate);
  } catch (error) {
    console.error(`Error fetching records for asset ${req.query.type}:`, error);
    res.status(500).json({ error: 'Failed to fetch asset records' });
  }
});

module.exports = router;