const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const dashboardRoutes = require('./routes/dashboard');
// const transactionRoutes = require('./routes/transactions');
const assetchartRouter = require('./routes/assetchart');
const transFormRouter = require('./routes/trans_form');
const companyCodesRouter = require('./routes/company_codes');
const aiAdvisorRouter = require('./routes/ai_advisor');
const stockRouter = require('./routes/stockroutes'); // Import stock routes
const latestStockRouter = require('./routes/latestStockRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/transactions', transactionRoutes);
app.use('/api/assetchart', assetchartRouter);
app.use('/api/trans-form', transFormRouter);
app.use('/api/company-codes', companyCodesRouter);
app.use('/api/ai-advisor', aiAdvisorRouter);
app.use('/api/stock', stockRouter); // Use stock routes
app.use('/api', latestStockRouter);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});