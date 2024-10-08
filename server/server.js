import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

// Enable CORS for frontend communication
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// PostgreSQL Connection Configuration
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Connect to the PostgreSQL database
db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Route to fetch all items from the "items" table
app.get("/api/items", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items");

    // Log the data received from the PostgreSQL database
    console.log("Data from Postgres:", result.rows);

    // Sends the rows from the "items" table as the response
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
