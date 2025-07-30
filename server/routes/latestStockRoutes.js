// server/routes/latestStockRoutes.js
const express = require('express');
const cors = require('cors');
const router = express.Router();
const { getLatestStockData } = require('./latestStockService');

// 使用 CORS 中间件
router.use(cors());

// GET /api/latest-stock/:symbol
// 根据股票代码获取最新股票数据
router.get('/latest-stock/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { startDate, endDate } = req.query; // 获取查询参数
        
        // 验证股票代码参数
        if (!symbol) {
            return res.status(400).json({ error: 'Stock symbol is required' });
        }
        
        // 调用服务函数获取最新股票数据，传递日期参数
        const stockData = await getLatestStockData(symbol, startDate, endDate);
        
        // 返回数据
        res.json(stockData);
    } catch (error) {
        console.error('Error fetching latest stock data:', error);
        res.status(500).json({ 
            error: 'Failed to fetch latest stock data',
            message: error.message 
        });
    }
});

// GET /api/latest-stock
// 通过查询参数获取最新股票数据
router.get('/latest-stock', async (req, res) => {
    try {
        const { symbol, startDate, endDate } = req.query; // 获取查询参数
        
        // 验证股票代码参数
        if (!symbol) {
            return res.status(400).json({ error: 'Stock symbol is required as query parameter' });
        }
        
        // 调用服务函数获取最新股票数据，传递日期参数
        const stockData = await getLatestStockData(symbol, startDate, endDate);
        
        // 返回数据
        res.json(stockData);
    } catch (error) {
        console.error('Error fetching latest stock data:', error);
        res.status(500).json({ 
            error: 'Failed to fetch latest stock data',
            message: error.message 
        });
    }
});

module.exports = router;