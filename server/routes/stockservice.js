// stockservice.js
const request = require('request');

// 将数据获取逻辑封装为函数，接受股票代码作为参数
const getStockData = (stockCode) => {
    return new Promise((resolve, reject) => {
        var requestOptions = {
            'url': `https://api.tiingo.com/tiingo/daily/${stockCode}/prices?startDate=2025-04-25&token=62e8df7810d508ca09286acbe2b79873b1ebe730`,
            'headers': {
                'Content-Type': 'application/json'
            }
        };

        request(requestOptions, function(error, response, body) {
            if (error) {
                reject(error);
            } else {
                try {
                    const data = JSON.parse(body);
                    resolve(data);
                } catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
};

// 保留原有的苹果股票数据函数以保持向后兼容
const getAppleStockData = () => {
    return getStockData('aapl');
};

// 导出函数供其他模块使用
module.exports = { getAppleStockData, getStockData };