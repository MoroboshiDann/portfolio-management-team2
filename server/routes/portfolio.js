const express = require('express');
const router = express.Router();
const db = require('../db');

// Get portfolio chart data
router.get('/chart-data', async (req, res) => {
  try {
    // Query to get portfolio values by month

    const query = `
    SELECT 
      MONTH(create_date) AS month,
      SUM(amount) as balance
      FROM portfolio
      GROUP BY month`;

    const [results] = await db.query(query);
    console.log("this is portfolio data --test");
    console.log(results);
    const values = results.map(row => parseFloat(row.balance));
    console.log(values);
    res.json({ values });
  } catch (error) {
    console.error('Error fetching portfolio chart data:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

module.exports = router;