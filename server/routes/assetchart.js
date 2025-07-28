const express = require('express');
const router = express.Router();
const db = require('../db');

// Get asset allocation data grouped by type
router.get('/asset-allocation', async (req, res) => {
  try {
    // Query to get sum of values grouped by asset type
    const query = `
      SELECT 
        type,
        SUM(value) AS total_value
      FROM portfolio_values
      GROUP BY type
      ORDER BY total_value DESC`;
    
    const [results] = await db.query(query);
    console.log("this is asset allocation data");
    
    // Format data for Chart.js
    const labels = results.map(row => {
      // Capitalize first letter of each type
      return row.type.charAt(0).toUpperCase() + row.type.slice(1);
    });
    
    const values = results.map(row => row.total_value);
    console.log(values);
    
    res.json({ 
      labels,
      values 
    });
  } catch (error) {
    console.error('Error fetching asset allocation data:', error);
    res.status(500).json({ error: 'Failed to fetch asset allocation data' });
  }
});

module.exports = router;