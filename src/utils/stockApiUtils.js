// src/utils/stockApiUtils.js

/**
 * 获取最新股票数据（只包含股票代码和价格）
 * @param {string} stockCode - 股票代码
 * @returns {Promise<Array>} 包含股票代码和价格的对象数组
 */
export const getLatestStockPrice = async (stockCode) => {
  try {
    const response = await fetch(`http://localhost:5000/api/stock/stock-data/${stockCode}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
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
export const getStockPriceByDate = async (stockCode, startDate) => {
  try {
    const response = await fetch(`http://localhost:5000/api/stock/stock-data/${stockCode}?startDate=${startDate}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
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