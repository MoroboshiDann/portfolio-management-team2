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
    
    // 返回格式化的选项，每个公司只显示一个选项
    const results = [];
    for (const row of rows) {
      // 创建显示标签：company_name (stock_code, bond_code)
      const displayLabel = `${row.name} (${row.stock_code}, ${row.bond_code})`;
      
      results.push({
        label: displayLabel,
        value: row.name, // 只返回公司名称作为值
        stockCode: row.stock_code,
        bondCode: row.bond_code,
        companyName: row.name
      });
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'DB error', detail: err.message });
  }
});

module.exports = router; 