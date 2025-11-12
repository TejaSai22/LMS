require('dotenv').config({ path: 'backend/.env' });
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

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

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

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

// API endpoint to get a single course by ID
app.get('/api/courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rows } = await pool.query('SELECT * FROM Course WHERE CourseID = $1', [courseId]);
    if (rows.length === 0) {
      return res.status(404).send('Course not found');
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching course');
  }
});

// API endpoint to get all users
app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT UserID, FirstName, LastName, Email, Role, DateCreated, LastLogin, IsActive FROM "User"');
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching users');
  }
});

// API endpoint to get all courses a user is enrolled in
app.get('/api/users/:userId/courses', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    // Ensure the authenticated user can only access their own courses
    if (req.user.userId !== parseInt(userId)) {
      return res.sendStatus(403);
    }
    const query = `
      SELECT c.*
      FROM Course c
      JOIN CourseOffering co ON c.CourseID = co.CourseID
      JOIN Enrollment e ON co.OfferingID = e.OfferingID
      WHERE e.StudentID = $1;
    `;
    const { rows } = await pool.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching user courses');
  }
});

// API endpoint to create a new user
app.post('/api/users', async (req, res) => {
  try {
    const { FirstName, LastName, Email, Password, Role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);
    const { rows } = await pool.query(
      'INSERT INTO "User" (FirstName, LastName, Email, PasswordHash, Role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [FirstName, LastName, Email, hashedPassword, Role]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error creating user');
  }
});

// API endpoint to enroll a student in a course
app.post('/api/enrollments', async (req, res) => {
  try {
    const { StudentID, OfferingID } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO Enrollment (StudentID, OfferingID) VALUES ($1, $2) RETURNING *',
      [StudentID, OfferingID]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error creating enrollment');
  }
});

// API endpoint for user login
app.post('/api/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const { rows } = await pool.query('SELECT * FROM "User" WHERE Email = $1', [Email]);
    if (rows.length === 0) {
      return res.status(400).send('Invalid email or password');
    }
    const user = rows[0];
    const validPassword = await bcrypt.compare(Password, user.passwordhash);
    if (!validPassword) {
      return res.status(400).send('Invalid email or password');
    }
    const token = jwt.sign({ userId: user.userid, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error logging in');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
