const express = require('express');
const router = express.Router();
const db = require('../db');

// Get monthly-asset chart data
router.get('/monthly-asset', async (req, res) => {
  try {
    // Query to get user asset values by month
    const query = `
    SELECT 
    MONTH(tran_date) AS month,
    SUM(amount) as monthly_asset
    FROM transaction
    GROUP BY month`;

    const [results] = await db.query(query);
    console.log("this is monthly asset data --test");
    console.log(results);
    const values = results.map(row => parseFloat(row.monthly_asset));
    console.log(values);
    res.json({ values });
  } catch (error) {
    console.error('Error fetching monthly asset chart data:', error);
    res.status(500).json({ error: 'Failed to fetch monthly asset data' });
  }
});

router.get('/transaction-data', async (req, res) => {
  try {
    const query = `
      SELECT
      QUARTER(tran_date) as quarter,
      SUM(ABS(amount)) as total_amount
      FROM transaction
      GROUP BY quarter`;
    
    const [results] = await db.query(query);
    console.log("this is transaction data");
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