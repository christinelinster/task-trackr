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

let tasks = [
    { id: 1, task: "Buy milk", list_id: "General" },
    { id: 2, task: "Finish homework", list_id: "Learning" },
];
  
let lists = [{id: 1, name: "Learning"},{id:2, name: "General"}]


// Route to fetch all items from the "items" table
app.get("/api/tasks", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks");

    // Log the data received from the PostgreSQL database
    console.log("Data from Postgres:", result.rows);

    // Sends the rows from the "items" table as the response
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/api/lists", async(req,res) => {
  try {
    const result = await db.query("SELECT * FROM lists");
    console.log("Data from Postgres:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Internal Server Error'})
  }
})

app.post("/api/lists", async(req,res) => {
  const {list} = req.body;

  if(!list){
    return res.status(400).json({error: "List name is required"});
  }

  try {
    const result = await db.query("INSERT INTO lists (name) VALUES ($1) RETURNING *;", [list])
    res.status(201).json(result.rows[0]);
    
  } catch (err) {
    console.error("Error inserting list:", err);
    res.status(500).json({ error: "Internal server error" });
  }
})

app.delete("/api/lists/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract the id from the request parameters

    // Check for items in the list 
    const hasTasks = await db.query("SELECT * FROM tasks WHERE list_id = ($1);", [id]);

    if(hasTasks.rowCount > 0){
      await db.query("DELETE FROM tasks WHERE list_id = ($1) RETURNING *;", [id]);
    } else {
      const result = await db.query("DELETE FROM lists WHERE id = ($1) RETURNING *", [id])
      // Check if the row was successfully deleted
      if (result.rowCount > 0) {
        res.json({ success: true, message: "List deleted", deletedList: result.rows[0] });
      } else {
        res.status(404).json({ success: false, message: "List not found" });
      }
    }

  } catch (err) {
    console.error("Error deleting list:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
