const express = require('express');
const router = express.Router();
const db = require('../db');

// Get portfolio chart data
router.get('/chart-data', async (req, res) => {
  try {
    // Query to get portfolio values by month

    const query = `
    SELECT 
      MONTH(date) AS month,
      AVG(value) as average_value
      FROM portfolio_values
      GROUP BY MONTH(date)`;
    
    const [results] = await db.query(query);
    console.log("this is portfolio data");
    
    const values = results.map(row => row.average_value);
    console.log(values);
    res.json({ values });
  } catch (error) {
    console.error('Error fetching portfolio chart data:', error);
    res.status(500).json({error: 'Failed to fetch portfolio data'});
  }
});

module.exports = router;