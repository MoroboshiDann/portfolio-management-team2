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
    case 'fixed deposits':
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
 * 生成缓存键
 * @param {string} stockCode - 股票代码
 * @param {string} date - 日期
 * @returns {string} 缓存键
 */
const generateCacheKey = (stockCode, date) => {
  return `stock_${stockCode}_${date}`;
};

/**
 * 从localStorage获取缓存数据
 * @param {string} key - 缓存键
 * @returns {object|null} 缓存数据或null
 */
const getFromCache = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      // 缓存时长设置为24小时(86400000毫秒)
      const cacheExpiry = 24 * 60 * 60 * 1000;
      if (Date.now() - parsed.timestamp < cacheExpiry) {
        console.log(`Cache hit for key: ${key}`);
        return parsed.data;
      } else {
        console.log(`Cache expired for key: ${key}`);
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Error reading from cache:', error);
  }
  return null;
};

/**
 * 将数据存储到localStorage缓存
 * @param {string} key - 缓存键
 * @param {object} data - 要缓存的数据
 */
const saveToCache = (key, data) => {
  try {
    const cacheItem = {
      timestamp: Date.now(),
      data: data
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
    console.log(`Data saved to cache with key: ${key}`);
  } catch (error) {
    console.error('Error saving to cache:', error);
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
    // 生成缓存键
    const cacheKey = generateCacheKey(stockCode, startDate);
    
    // 首先尝试从缓存中获取数据
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // 检查是否传入了日期
    if (startDate) {
      // 获取当前日期（格式：YYYY-MM-DD）
      const today = new Date().toISOString().split('T')[0];
      // 格式化输入日期
      const inputDate = new Date(startDate).toISOString().split('T')[0];
      
      // 如果输入日期是今天，则获取最新数据并模拟当前价格
      if (inputDate === today) {
        // 获取最新数据（不传日期参数）
        const latestData = await getLatestStockData(stockCode);
        
        // 取最新的一条数据
        if (latestData && latestData.length > 0) {
          const latestItem = latestData[0];
          
          // 添加随机波动（±0.2%）
          const fluctuation = 0.002; // 0.2%
          const randomFactor = 1 + (Math.random() * 2 - 1) * fluctuation;
          const simulatedPrice = latestItem.open * randomFactor;
          
          const result = [{
            symbol: stockCode,
            price: simulatedPrice,
            date: latestItem.date.split('T')[0]
          }];
          
          // 保存到缓存
          saveToCache(cacheKey, result);
          
          return result;
        }
      }
    }
    
    // 原有逻辑：获取特定日期的数据
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
    
    // 保存到缓存
    saveToCache(cacheKey, result);
    
    console.log(`Successfully fetched stock price for ${stockCode} on ${startDate}:`, result);
    return result;
  } catch (error) {
    console.error(`获取特定日期股票数据失败 for ${stockCode}:`, error);
    throw error;
  }
};

module.exports = { getLatestStockPrice, getStockPriceByDate, generateRandomPrice };