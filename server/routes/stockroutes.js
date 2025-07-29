// server/routes/stockRoutes.js
const express = require('express');
const cors = require('cors');
const router = express.Router();
const { getStockData } = require('./stockservice.js');

router.use(cors());

// GET /api/stock-data/:symbol
router.get('/stock-data/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const stockData = await getStockData(symbol);
        res.json(stockData);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// 或者通过查询参数获取股票代码
router.get('/stock-data', async (req, res) => {
    try {
        const { symbol } = req.query;
        if (!symbol) {
            return res.status(400).json({ error: 'Stock symbol is required' });
        }
        const stockData = await getStockData(symbol);
        res.json(stockData);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

module.exports = router;