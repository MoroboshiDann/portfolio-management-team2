const express = require('express');
const router = express.Router();
const db = require('../db');

// POST endpoint to save transaction data to portfolio table
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const { type, amount, name } = req.body;

    // Validate required fields
    if (!type || amount === undefined || !name) {
      return res.status(400).json({
        error: 'Missing required fields: type, amount, and name are required'
      });
    }

    // get portfolio record
    const findPorfolioRecord = `
      SELECT * 
      FROM portfolio
      WHERE type = ? and name = ?
    `;
    const [portfolioRecord] = await db.query(findPorfolioRecord, [type, name]);
    const recordAmount = portfolioRecord[0] == null ? 0 : parseFloat(portfolioRecord[0].amount);


    const findPrice = `
    SELECT price FROM share_price WHERE name = ?
    `;
    const [priceRecord] = await db.query(findPrice, [name]);
    console.log(`this is ${priceRecord[0].price}`);
    // const openPrice = await fetch()
    const quantity = parseFloat(amount) / parseFloat(priceRecord[0].price);
    console.log(quantity);

    // sell branch 
    if (amount < 0) {
      console.log(`this is the sum of record and input value: ${recordAmount + amount}`);
      if (portfolioRecord[0] == null) {
        return res.status(400).json({
          error: 'do not have asset'
        });
      }
      if (recordAmount + amount < 0) {
        return res.status(400).json({
          error: 'Not enough amount'
        });
      }
    } else { // buy branch
      if (portfolioRecord[0] == null) {
        const newRecord = `
          INSERT INTO portfolio (type, amount, name, quantity)
          VALUES (?, ?, ?, ?)
        `;
        const reuslt = await db.query(newRecord, [type, amount, name, quantity]);
        const insertTransaction = `
          INSERT INTO transaction (amount, name) VALUES (?,?)
        `;
        await db.query(insertTransaction, [amount, name]);
        return res.status(201).json({
          id: reuslt.id,
          message: 'Transaction saved successfully',
          data: { type, amount, name, quantity }
        });
      }

    }
    const updateRecord = `
      UPDATE portfolio
      SET amount = amount + ?, quantity = quantity + ?
      WHERE type = ? AND name = ?
    `;
    const result = await db.query(updateRecord, [amount, quantity, type, name]);

    const insertTransaction = `
      INSERT INTO transaction (amount, name) VALUES (?,?)
    `;
    await db.query(insertTransaction, [amount, name]);

    res.status(201).json({
      id: result.id,
      message: 'Transaction saved successfully',
      data: { type, amount, name, quantity }
    });

  } catch (error) {
    console.error('Error saving transaction to portfolio table:', error);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});



module.exports = router; 