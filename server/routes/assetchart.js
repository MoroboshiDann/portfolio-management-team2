const express = require('express');
const router = express.Router();
const db = require('../db');

// Get aggregated asset allocation data
router.get('/asset-allocation', async (req, res) => {
  try {
    // SQL query to sum amounts grouped by asset type
    const query = `
      SELECT 
        asset,
        SUM(amount) AS total_value
      FROM portfolio
      GROUP BY asset
      ORDER BY total_value DESC`;
    
    const [results] = await db.query(query);
    console.log("Asset allocation data retrieved successfully");
    
    // Format data for Chart.js
    const labels = results.map(row => {
      // Capitalize first letter of asset type
      return row.asset.charAt(0).toLowerCase() + row.asset.slice(1);
    });
    
    const values = results.map(row => row.total_value);
    console.log("Asset values:", values);
    
    res.json({ 
      labels,
      values 
    });
  } catch (error) {
    console.error('Error fetching asset allocation data:', error);
    res.status(500).json({ error: 'Failed to fetch asset allocation data' });
  }
});

// Get detailed records for specific asset type
router.get('/asset-records', async (req, res) => {
  try {
    const { asset } = req.query;
    
    if (!asset) {
      return res.status(400).json({ error: 'Missing asset type parameter' });
    }

    const query = `
      SELECT 
        id,
        name,
        asset,
        amount,
        create_date
      FROM portfolio
      WHERE asset = ?
      ORDER BY create_date DESC`;
    
    const [results] = await db.query(query, [asset.toLowerCase()]);
    console.log(`Retrieved ${results.length} records for asset type: ${asset}`);
    
    res.json(results);
  } catch (error) {
    console.error(`Error fetching records for asset ${req.query.asset}:`, error);
    res.status(500).json({ error: 'Failed to fetch asset records' });
  }
});

module.exports = router;