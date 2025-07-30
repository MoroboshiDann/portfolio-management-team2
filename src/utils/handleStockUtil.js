// src/utils/handleStockUtil.js
const { getLatestStockData } = require('../../server/routes/latestStockService');

/**
 * 获取特定日期的股票数据（只包含股票代码和价格）
 * @param {string} stockCode - 股票代码
 * @param {string} date - 日期 (YYYY-MM-DD格式)
 * @returns {Promise<Array>} 包含股票代码和价格的对象数组
 */
const getLatestStockPrice = async (stockCode, date = '2025-07-29') => {
  try {
    // 使用getStockPriceByDate函数来获取指定日期的股票价格
    const result = await getStockPriceByDate(stockCode, date);
    
    console.log(`Successfully fetched stock price for ${stockCode} on ${date}:`, result);
    return result;
  } catch (error) {
    console.error(`获取股票数据失败 for ${stockCode} on ${date}:`, error);
    throw error;
  }
};

/**
 * 生成随机价格用于非股票资产
 * @param {string} assetType - 资产类型
 * @param {string} assetName - 资产名称
 * @returns {number} 随机价格
 */
const generateRandomPrice = (assetType, assetName) => {
  // 根据资产类型生成不同范围的随机价格
  let minPrice, maxPrice;
  
  switch (assetType.toLowerCase()) {
    case 'mutual funds':
      minPrice = 10;
      maxPrice = 100;
      break;
    case 'gold':
      minPrice = 1800;
      maxPrice = 2200;
      break;
    case 'real estate':
      minPrice = 100000;
      maxPrice = 500000;
      break;
    case 'fixed deposite':
      minPrice = 1;
      maxPrice = 1.1;
      break;
    case 'bonds':
      minPrice = 50;
      maxPrice = 200;
      break;
    default:
      minPrice = 10;
      maxPrice = 100;
  }
  
  const randomPrice = Math.random() * (maxPrice - minPrice) + minPrice;
  console.log(`Generated random price for ${assetName} (${assetType}): $${randomPrice.toFixed(2)}`);
  
  return parseFloat(randomPrice.toFixed(2));
};

/**
 * 获取特定日期的股票数据（只包含股票代码和价格）
 * @param {string} stockCode - 股票代码
 * @param {string} startDate - 开始日期
 * @returns {Promise<Array>} 包含股票代码和价格的对象数组
 */
const getStockPriceByDate = async (stockCode, startDate) => {
  try {
    const data = await getLatestStockData(stockCode, startDate);
    
    // 检查数据是否为数组
    if (!Array.isArray(data)) {
      console.error(`getLatestStockData returned non-array data for ${stockCode}:`, data);
      throw new Error(`Invalid data format for stock ${stockCode}`);
    }
    
    // 检查数据是否为空
    if (data.length === 0) {
      console.error(`No data returned for stock ${stockCode} on ${startDate}`);
      throw new Error(`No data available for stock ${stockCode} on ${startDate}`);
    }
    
    // 提取特定日期的数据，只保留股票代码、开盘价格和日期
    const result = data.map(item => ({
      symbol: stockCode,
      price: item.open,
      date: item.date.split('T')[0] // 只保留年月日部分
    }));
    
    console.log(`Successfully fetched stock price for ${stockCode} on ${startDate}:`, result);
    return result;
  } catch (error) {
    console.error(`获取特定日期股票数据失败 for ${stockCode}:`, error);
    throw error;
  }
};

module.exports = { getLatestStockPrice, getStockPriceByDate, generateRandomPrice };