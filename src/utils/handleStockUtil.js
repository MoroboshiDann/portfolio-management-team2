// src/utils/handleStockUtil.js
const { getLatestStockData } = require('../../server/routes/latestStockService');

/**
 * 获取最新股票数据（只包含股票代码和价格）
 * @param {string} stockCode - 股票代码
 * @returns {Promise<Array>} 包含股票代码和价格的对象数组
 */
const getLatestStockPrice = async (stockCode) => {
  try {
    const data = await getLatestStockData(stockCode);
    
    // 提取最新的两条数据，只保留股票代码和开盘价格（重命名为price）
    const result = data.slice(0, 2).map(item => ({
      symbol: stockCode,
      price: item.open
    }));
    
    return result;
  } catch (error) {
    console.error('获取最新股票数据失败:', error);
    throw error;
  }
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
    
    // 提取特定日期的数据，只保留股票代码、开盘价格和日期
    const result = data.map(item => ({
      symbol: stockCode,
      price: item.open,
      date: item.date.split('T')[0] // 只保留年月日部分
    }));
    
    return result;
  } catch (error) {
    console.error('获取特定日期股票数据失败:', error);
    throw error;
  }
};

module.exports = { getLatestStockPrice, getStockPriceByDate };