const express = require('express');
const bodyParser = require('boday-parser');
const app = express();
const mysql = require('mysql2');

const PORT = 3000;

app.use(express.json());

const db = mysql.createConnection({
    host : 'localhost',
    user : 'student',
    password : '123123',
    database : 'databasename'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database', err);
        process.exit(1);
    }
    console.log('Connected to database');
    // start server 
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});