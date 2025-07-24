const express = require('express');
const router = express.Router();
const db = require('../db');

// Get portfolio chart data
router.get('/chart-data', async (req, res) => {
  try {
    // Query to get portfolio values by month
    // const query = `
    //   SELECT 
    //     DATE_FORMAT(date, '%Y-%m') AS month,
    //     SUM(value) AS total_value
    //   FROM portfolio_values
    //   GROUP BY DATE_FORMAT(date, '%Y-%m')
    //   ORDER BY month ASC
    //   LIMIT 12`;
    const query = `
    SELECT 
      MONTH(date) AS month,
      AVG(value) as average_value
      FROM portfolio_values
      GROUP BY MONTH(date)`;
    
    const [results] = await db.query(query);
    console.log("this is portfolio data");
    // console.log(results);
    // Format data for Chart.js
    // const labels = results.map(row => {
    //   const [month] = row.month;
    //   return new Date(month - 1).toLocaleString('default', { month: 'long'});
    // });
    
    const values = results.map(row => row.average_value);
    console.log(values);
    res.json({ values });
  } catch (error) {
    console.error('Error fetching portfolio chart data:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

module.exports = router;