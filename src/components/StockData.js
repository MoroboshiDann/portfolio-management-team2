// src/components/StockData.js
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const StockData = () => {
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [symbol, setSymbol] = useState('aapl'); // 默认股票代码
    const [inputSymbol, setInputSymbol] = useState('aapl'); // 输入框中的股票代码
    const [searchHistory, setSearchHistory] = useState(['aapl']); // 存储查询历史

    // 生成缓存键
    const generateCacheKey = (symbol) => {
        return `stock_data_${symbol}`;
    };

    // 从localStorage获取缓存数据
    const getFromCache = (key) => {
        try {
            const cached = localStorage.getItem(key);
            if (cached) {
                const parsed = JSON.parse(cached);
                // 缓存时长设置为1小时(3600000毫秒)
                const cacheExpiry = 60 * 60 * 1000;
                if (Date.now() - parsed.timestamp < cacheExpiry) {
                    console.log(`Stock data cache hit for key: ${key}`);
                    return parsed.data;
                } else {
                    console.log(`Stock data cache expired for key: ${key}`);
                    localStorage.removeItem(key);
                }
            }
        } catch (error) {
            console.error('Error reading stock data from cache:', error);
        }
        return null;
    };

    // 将数据存储到localStorage缓存
    const saveToCache = (key, data) => {
        try {
            const cacheItem = {
                timestamp: Date.now(),
                data: data
            };
            localStorage.setItem(key, JSON.stringify(cacheItem));
            console.log(`Stock data saved to cache with key: ${key}`);
        } catch (error) {
            console.error('Error saving stock data to cache:', error);
        }
    };

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // 生成缓存键
                const cacheKey = generateCacheKey(symbol);
                
                // 首先尝试从缓存中获取数据
                const cachedData = getFromCache(cacheKey);
                if (cachedData) {
                    setStockData(cachedData);
                    
                    // 添加到搜索历史（避免重复）
                    setSearchHistory(prevHistory => {
                        if (!prevHistory.includes(symbol.toLowerCase())) {
                            return [...prevHistory, symbol.toLowerCase()];
                        }
                        return prevHistory;
                    });
                    
                    setLoading(false);
                    return;
                }
                
                // 调用后端 API，使用动态股票代码
                const response = await fetch(`http://localhost:5000/api/stock/stock-data/${symbol}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStockData(data);
                
                // 保存到缓存
                saveToCache(cacheKey, data);
                
                // 添加到搜索历史（避免重复）
                setSearchHistory(prevHistory => {
                    if (!prevHistory.includes(symbol.toLowerCase())) {
                        return [...prevHistory, symbol.toLowerCase()];
                    }
                    return prevHistory;
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, [symbol]); // 当symbol改变时重新获取数据

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedSymbol = inputSymbol.trim().toLowerCase();
        if (trimmedSymbol) {
            setSymbol(trimmedSymbol); // 更新股票代码以触发重新获取数据
        }
    };

    // 点击历史记录按钮
    const handleHistoryClick = (ticker) => {
        setSymbol(ticker);
        setInputSymbol(ticker);
    };

    if (loading && stockData.length === 0) return <div className="loading">Loading stock data...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    // 准备图表数据（使用最近100条数据，约一年）
    const chartData = stockData.slice(0, 100).map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close
    })); // 反转以按时间顺序显示

    return (
        <div className="stock-data-container">
            <h2>Stock Historical Prices</h2>
            
            {/* 添加搜索框 */}
            <div className="stock-search-container" style={{ marginBottom: '20px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={inputSymbol}
                        onChange={(e) => setInputSymbol(e.target.value)}
                        placeholder="Enter stock symbol (e.g., aapl, goog, msft)"
                        style={{
                            padding: '8px',
                            fontSize: '16px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            flex: 1,
                            maxWidth: '300px'
                        }}
                    />
                    <button 
                        type="submit"
                        style={{
                            padding: '8px 16px',
                            fontSize: '16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Search
                    </button>
                </form>
                <p style={{ marginTop: '5px', fontStyle: 'italic' }}>
                    Current symbol: <strong>{symbol.toUpperCase()}</strong>
                </p>
            </div>

            {/* 添加折线图 */}
            <div className="stock-chart-container" style={{ width: '100%', height: '400px', marginBottom: '30px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            interval="preserveStartEnd"
                        />
                        <YAxis 
                            domain={['auto', 'auto']} 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                        />
                        <Tooltip 
                            formatter={(value) => [`$${value.toFixed(2)}`, '']}
                            labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="open" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                            name="Open Price"
                            strokeWidth={2}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="close" 
                            stroke="#82ca9d" 
                            name="Close Price"
                            strokeWidth={2}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="high" 
                            stroke="#ff7300" 
                            name="High Price"
                            strokeWidth={1}
                            strokeDasharray="3 3"
                        />
                        <Line 
                            type="monotone" 
                            dataKey="low" 
                            stroke="#ff0000" 
                            name="Low Price"
                            strokeWidth={1}
                            strokeDasharray="3 3"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 搜索历史按钮列表 */}
            <div className="search-history-container">
                <h3>Search History</h3>
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '10px', 
                    marginTop: '10px' 
                }}>
                    {searchHistory.map((ticker, index) => (
                        <button
                            key={index}
                            onClick={() => handleHistoryClick(ticker)}
                            style={{
                                padding: '6px 12px',
                                fontSize: '14px',
                                backgroundColor: ticker === symbol ? '#007bff' : '#f8f9fa',
                                color: ticker === symbol ? 'white' : '#333',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            title={`View ${ticker.toUpperCase()} chart`}
                        >
                            {ticker.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StockData;