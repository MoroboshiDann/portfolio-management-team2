const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/company-codes?query=xxx
router.get('/', async (req, res) => {
  const query = req.query.query || '';
  if (!query) return res.json([]);

  try {
    // 在 company_code 表中模糊搜索 name、stock_code、bond_code
    const sql = `
      SELECT name, stock_code, bond_code
      FROM company_code
      WHERE name LIKE ? OR stock_code LIKE ? OR bond_code LIKE ?
      LIMIT 10
    `;
    const likeQuery = `%${query}%`;
    const [rows] = await db.query(sql, [likeQuery, likeQuery, likeQuery]);
    // 返回所有匹配项
    const results = [];
    for (const row of rows) {
      if (row.stock_code) {
        results.push({
          label: `${row.name} (${row.stock_code}) [Stock]`,
          value: row.stock_code,
          type: 'Stock',
          name: row.name
        });
      }
      if (row.bond_code) {
        results.push({
          label: `${row.name} (${row.bond_code}) [Bonds]`,
          value: row.bond_code,
          type: 'Bonds',
          name: row.name
        });
      }
      // 也可直接选择公司名
      results.push({
        label: `${row.name} [CompanyName]`,
        value: row.name,
        type: 'CompanyName',
        name: row.name
      });
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'DB error', detail: err.message });
  }
});

module.exports = router; 