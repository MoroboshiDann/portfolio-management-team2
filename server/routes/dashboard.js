const express = require('express');
const router = express.Router();
const db = require('../db');

// Get monthly-asset chart data
router.get('/monthly-asset', async (req, res) => {
  try {
    const { year = 2025 } = req.query;
    // Query to get user asset values by month for specific year
    const query = `
    SELECT 
    MONTH(date) AS month,
    SUM(amount) as monthly_asset
    FROM portfolio
    WHERE YEAR(date) = ?
    GROUP BY month`;

    const [results] = await db.query(query, [year]);
    console.log("this is monthly asset data --test");
    console.log(results);
    const monthlyData = results.map(row => ({
      month: row.month,
      value: parseFloat(row.monthly_asset)
    }));
    console.log(monthlyData);
    res.json({ monthlyData });
  } catch (error) {
    console.error('Error fetching monthly asset chart data:', error);
    res.status(500).json({ error: 'Failed to fetch monthly asset data' });
  }
});

router.get('/transaction-data', async (req, res) => {
  try {
    const { year = 2025 } = req.query;
    const query = `
      SELECT
      QUARTER(tran_date) as quarter,
      SUM(ABS(amount)) as total_amount
      FROM transaction
      WHERE YEAR(tran_date) = ?
      GROUP BY quarter`;
    
    const [results] = await db.query(query, [year]);
    console.log("this is transaction data");
    console.log(results);
    const quarterlyData = results.map(row => ({
      quarter: row.quarter,
      value: parseFloat(row.total_amount)
    }));
    
    res.json({ quarterlyData });
  } catch (error) {
    console.error('Error fetching transaction chart data:', error);
    res.status(500).json({ error: 'Failed to fetch transaction data' });
  }
});

module.exports = router;