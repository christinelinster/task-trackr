import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

let refreshTokens = []; 

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

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateAccessToken(user){
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}

app.post("/api/register", async (req, res) => {
  const saltRounds = 10;
  const { username, password } = req.body;
  bcrypt.hash(password, saltRounds, async function (err, hash) {
    if (err) {
      console.error("Error hashing password:", err);
      res.status(500).json({ error: "Error hashing password" });
      return;
    }

    try {
      console.log("Attempting to insert user into database");
      const result = await db.query(
        "INSERT INTO USERS (username, password) VALUES ($1, $2) RETURNING *;",
        [username, hash]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Inernal Server Error" });
    }
  });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (result.rowCount === 0) {
    res.status(401).json({ error: "Invalid username" });
    return;
  }
  const user = result.rows[0];
  try {
    if( await bcrypt.compare(password, user.password)) {
          const accessToken = generateAccessToken({user: user.username})
          const refreshToken = jwt.sign({user: user.username}, process.env.REFRESH_TOKEN_SECRET);
          refreshTokens.push(refreshToken);
          res.json({ accessToken, refreshToken });
    }else{
      res.send("Not Allowed");
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal Server " });
  }
});

app.delete("/api/logout", (req,res) => {
   refreshTokens = refreshTokens.filter(token => token !== req.body.token)
   res.sendStatus(204); 
})

app.post("/api/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({user: user.username});
    res.json({ accessToken });
  }); 
});

app.get("/api/home", authenticateToken, async (req, res) => {
  try {
    const taskResult = await db.query(
      "SELECT * FROM tasks WHERE task != '' ORDER BY id ASC"
    );
    const listResult = await db.query("SELECT * FROM lists ORDER by id ASC");

    res.json({
      tasks: taskResult.rows,
      lists: listResult.rows,
    });
  } catch (err) {
    console.error("Error getting the home page:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch all items from the "items" table
app.get("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM tasks WHERE task != '' ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Route to fetch all items from the "lists" table
app.get("/api/lists", authenticateToken, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM lists ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/api/lists", authenticateToken, async (req, res) => {
  const { list } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO lists (name, selected) VALUES ($1, $2) RETURNING *;",
      [list, true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting list:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/tasks", authenticateToken, async (req, res) => {
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

app.patch("/api/lists/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { list } = req.body;

  try {
    const result = await db.query(
      "UPDATE lists SET name = ($1) WHERE id = ($2) RETURNING *",
      [list, id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error editing list: ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.patch("/api/tasks/:id", authenticateToken, async (req, res) => {
  console.log("Edit request received for task ID:", req.params.id);

  const { id } = req.params;
  const { task } = req.body;
  try {
    const result = await db.query(
      "UPDATE tasks SET task=($1) WHERE id =($2) RETURNING *;",
      [task, id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error editing task:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/api/lists/:id", authenticateToken, async (req, res) => {
  console.log("Delete request received for list ID:", req.params.id);

  try {
    const { id } = req.params;

    const hasTasks = await db.query(
      "SELECT * FROM tasks WHERE list_id = ($1);",
      [id]
    );

    if (hasTasks.rowCount > 0) {
      await db.query("DELETE FROM tasks WHERE list_id = ($1);", [id]);
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

app.delete("/api/tasks/:id", authenticateToken, (req, res) => {
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

app.patch("/api/selected-lists", authenticateToken, async (req, res) => {
  const { listID } = req.body;
  try {
    const result = await db.query(
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
