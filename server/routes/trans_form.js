const express = require('express');
const router = express.Router();
const db = require('../db');

// POST endpoint to save transaction data to portfolio table
router.post('/', async (req, res) => {
  try {
    const { asset, amount, name } = req.body;
    
    // Validate required fields
    if (!asset || amount === undefined || !name) {
      return res.status(400).json({ 
        error: 'Missing required fields: asset, amount, and name are required' 
      });
    }

    // Insert data into portfolio table, let create_date use default value
    const query = `
      INSERT INTO portfolio (asset, amount, name)
      VALUES (?, ?, ?)
    `;
    
    const [result] = await db.query(query, [asset, amount, name]);
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Transaction saved successfully',
      data: { asset, amount, name }
    });
    
  } catch (error) {
    console.error('Error saving transaction to portfolio table:', error);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

// GET endpoint to retrieve all transactions from portfolio table
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, asset, amount, name, create_date
      FROM portfolio
      ORDER BY create_date DESC
    `;
    
    const [results] = await db.query(query);
    res.json(results);
    
  } catch (error) {
    console.error('Error fetching transactions from portfolio table:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router; 