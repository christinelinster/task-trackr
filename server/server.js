import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import pkg from 'pg';

const {Pool} = pkg; 

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// app.post("/api/register", async (req, res) => {
//   const saltRounds = 10;
//   const { username, password } = req.body;
//   bcrypt.hash(password, saltRounds, async function (err, hash) {
//     if (err) {
//       console.error("Error hashing password:", err);
//       res.status(500).json({ error: "Error hashing password" });
//       return;
//     }

//     try {
//       console.log("Attempting to insert user into database");
//       const result = await pool.query(
//         "INSERT INTO USERS (username, password) VALUES ($1, $2) RETURNING *;",
//         [username, hash]
//       );
//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error("Database error:", err);
//       res.status(500).json({ error: "Inernal Server Error" });
//     }
//   });
// });

// Route to fetch all items from the "items" table
app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE task != '' ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Route to fetch all items from the "lists" table
app.get("/api/lists", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM lists ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/api/lists", async (req, res) => {
  const { list } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO lists (name, selected) VALUES ($1, $2) RETURNING *;",
      [list, true]
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
    const result = await pool.query(
      "INSERT INTO tasks (task, list_id) VALUES ($1, $2) RETURNING *;",
      [addTask, listID]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting task", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/api/lists/:id", async (req, res) => {
  const { id } = req.params;
  const { list } = req.body;

  try {
    const result = await pool.query(
      "UPDATE lists SET name = ($1) WHERE id = ($2) RETURNING *",
      [list, id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error editing list: ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  console.log("Edit request received for task ID:", req.params.id);

  const { id } = req.params;
  const { task } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tasks SET task=($1) WHERE id =($2) RETURNING *;",
      [task, id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error editing task:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/api/lists/:id", async (req, res) => {
  console.log("Delete request received for list ID:", req.params.id);

  try {
    const { id } = req.params;

    const hasTasks = await pool.query(
      "SELECT * FROM tasks WHERE list_id = ($1);",
      [id]
    );

    if (hasTasks.rowCount > 0) {
      await pool.query("DELETE FROM tasks WHERE list_id = ($1);", [id]);
      const result = await pool.query(
        "DELETE FROM lists WHERE id = ($1) RETURNING *",
        [id]
      );
      res.json({
        success: true,
        message: "List deleted",
        deletedList: result.rows[0],
      });
    } else {
      const result = await pool.query(
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
      const result = await pool.query(
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

app.patch("/api/selected-lists", async (req, res) => {
  const { listID } = req.body;
  try {
    const result = await pool.query(
      "UPDATE lists SET selected = NOT selected WHERE id = ($1) RETURNING *;",
      [listID]
    );
    console.log(result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error selecting list: ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
