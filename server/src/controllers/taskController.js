import pool from "../config/database.js";

export async function getTasks(req,res,next){
    try {
        const result = await pool.query(
          "SELECT * FROM tasks WHERE task != '' ORDER BY id ASC"
        );
        res.json(result.rows);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        next(err); 
      }
}

export async function createTask(req,res,next) {
    const { addTask, listID } = req.body;
  
    try {
      const result = await pool.query(
        "INSERT INTO tasks (task, list_id) VALUES ($1, $2) RETURNING *;",
        [addTask, listID]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error creating task", err);
      next(err); 
    }
}

export async function updateTask(req, res, next) {
    const { id } = req.params;
    const { task } = req.body;
    try {
      const result = await pool.query(
        "UPDATE tasks SET task = ($1) WHERE id = ($2) RETURNING *;",
        [task, id]
      );
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error("Error updating task:", err);
      next(err);
    }
  }

  export async function deleteTask(req, res, next) {
    const { id } = req.params;
    try {
      const result = await pool.query(
        "DELETE FROM tasks WHERE id = ($1) RETURNING *;",
        [id]
      );
      res.status(200).json({
        success: true,
        message: "Task deleted",
        deletedTask: result.rows[0],
      });
    } catch (err) {
      console.error("Error deleting task:", err);
      next(err);
    }
  }