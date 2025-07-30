// server/routes/latestStockService.js
const request = require('request');

// 获取最新股票数据的函数（不包含startDate参数）
const getLatestStockData = (stockCode, startDate = null, endDate = null) => {
    return new Promise((resolve, reject) => {
        
        // 基础URL
        let url = `https://api.tiingo.com/tiingo/daily/${stockCode}/prices?token=62e8df7810d508ca09286acbe2b79873b1ebe730`;
        
        // 如果提供了startDate
        if (startDate) {
            // 如果没有提供endDate，则endDate默认等于startDate
            if (!endDate) {
                endDate = startDate;
            }
            url += `&startDate=${startDate}&endDate=${endDate}`;
        }

        var requestOptions = {
            'url': url,
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


// 导出函数供其他模块使用
module.exports = { getLatestStockData };