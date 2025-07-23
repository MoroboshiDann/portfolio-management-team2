const express = require('express');
const bodyParser = require('boday-parser');
const app = express();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host : 'localhost',
    user : 'student',
    password : '123123',
    database : 'databasename'
});
