const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, portfolio_id, transaction_date, amount, type, description
      FROM transactions
      ORDER BY transaction_date DESC`;
    
    const [results] = await db.query(query);
    res.json(results);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Add new transaction
router.post('/', async (req, res) => {
  try {
    const { portfolio_id, transaction_date, amount, type, description } = req.body;
    
    const query = `
      INSERT INTO transactions (portfolio_id, transaction_date, amount, type, description)
      VALUES (?, ?, ?, ?, ?)`;
    
    const [result] = await db.query(query, [portfolio_id, transaction_date, amount, type, description]);
    res.json({ id: result.insertId, message: 'Transaction added successfully' });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// Get transaction chart data
router.get('/chart-data', async (req, res) => {
  try {
    const query = `
      SELECT
        QUARTER(transaction_date) as quarter,
        SUM(ABS(amount)) as total_amount
        FROM transactions
        GROUP BY quarter`;
    
    const [results] = await db.query(query);
    console.log("this is transaction   data");
    console.log(results);
    // const labels = results.map(row => `Q${row.quarter} ${row.year}`);
    const values = results.map(row => parseFloat(row.total_amount));
    
    res.json({ values });
  } catch (error) {
    console.error('Error fetching transaction chart data:', error);
    res.status(500).json({ error: 'Failed to fetch transaction data' });
  }
});

module.exports = router;