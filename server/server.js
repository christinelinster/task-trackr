import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";

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
  port: process.env.DB_PORT,
});

// Connect to the PostgreSQL database
db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

let tasks = [
  { id: 1, task: "Buy milk", list_id: "General" },
  { id: 2, task: "Finish homework", list_id: "Learning" },
];

let lists = [
  { id: 1, name: "Learning" },
  { id: 2, name: "General" },
];

// Route to fetch all items from the "items" table
app.get("/api/tasks", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks WHERE task != '' ORDER BY id ASC");
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Route to fetch all items from the "lists" table
app.get("/api/lists", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM lists ORDER BY id ASC");
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/api/lists", async (req, res) => {
  const { list } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO lists (name) VALUES ($1) RETURNING *;",
      [list]
    );
    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Error inserting list:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { addTask } = req.body;
  const { listID } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO tasks (task, list_id) VALUES ($1, $2) RETURNING *;",
      [addTask, listID]
    );
    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Error inserting task", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/api/lists/:id", async(req,res) => {
  const {id} = req.params;
  const {list} = req.body;
  
  try {
    const result = await db.query(
      "UPDATE lists SET name = ($1) WHERE id = ($2) RETURNING *", [list, id]
    )
    res.status(201).json(result.rows[0]);
    
  } catch (err) {
    console.error("Error editing list: ", err)
    res.status(500).json({success:false, message: "Server error"})
  }
})

app.patch("/api/tasks/:id", async(req,res) => {
  console.log("Edit request received for task ID:", req.params.id);

  const {id} = req.params;
  const {task} = req.body;
  try {
    const result = await db.query(
      "UPDATE tasks SET task=($1) WHERE id =($2) RETURNING *;", [task, id]
    );
    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Error editing task:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
})

app.delete("/api/lists/:id", async (req, res) => {
  console.log("Delete request received for list ID:", req.params.id);

  try {
    const { id } = req.params; 

    const hasTasks = await db.query(
      "SELECT * FROM tasks WHERE list_id = ($1);",
      [id]
    );

    if (hasTasks.rowCount > 0) {
      await db.query("DELETE FROM tasks WHERE list_id = ($1);", [
        id,
      ]);
      const result = await db.query(
        "DELETE FROM lists WHERE id = ($1) RETURNING *",
        [id]
      );
      res.json({
        success: true,
        message: "List deleted",
        deletedList: result.rows[0],
      });

    } else {
      const result = await db.query(
        "DELETE FROM lists WHERE id = ($1) RETURNING *",
        [id]
      );
      res.json({
        success: true,
        message: "List deleted",
        deletedList: result.rows[0],
      });
    }
  } catch (err) {
    console.error("Error deleting list:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  setTimeout(async () => {
    try {
      const result = await db.query(
        "DELETE FROM tasks WHERE id = ($1) RETURNING *;",
        [id]
      );
      res.json({
        success: true,
        message: "Task deleted",
        deletedTask: result.rows[0],
      });
      
    } catch (err) {
      console.error("Error deleting task: ", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }, 500);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
