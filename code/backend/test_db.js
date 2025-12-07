const { Pool } = require('pg');
require('dotenv').config();

console.log('Connecting to:', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.query('SELECT * FROM "User" LIMIT 1', (err, res) => {
    if (err) {
        console.error('Query Error:', err);
    } else {
        if (res.rows.length > 0) {
            console.log('User Row Keys:', Object.keys(res.rows[0]));
            console.log('User Row:', res.rows[0]);
        } else {
            console.log('No users found.');
        }
    }
    pool.end();
});
