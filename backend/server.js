require('dotenv').config({ path: 'backend/.env' });
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Create a connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Successfully connected to the database at', res.rows[0].now);
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// API endpoint to get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM Course');
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching courses');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
