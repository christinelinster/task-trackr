import pool from "../config/database.js";

export async function getLists(req, res, next) {
  const userId = req.user.id;
  try {
    console.log("getLists function called", req.user, req.id);
    const result = await pool.query(
      "SELECT * FROM lists WHERE user_id = ($1) ORDER BY id ASC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching lists:", err);
    next(err);
  }
}

export async function createList(req, res, next) {
  const { list } = req.body;
  const userId = req.user.id;
  try {
    console.log("createList function called", req.user, req.id);
    const result = await pool.query(
      "INSERT INTO lists (name, selected, user_id) VALUES ($1, $2, $3) RETURNING *;",
      [list, true, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating list:", err);
    next(err);
  }
}

export async function updateList(req, res, next) {
  const { id } = req.params;
  const { list } = req.body;
  try {
    const result = await pool.query(
      "UPDATE lists SET name = ($1) WHERE id = ($2) RETURNING *;",
      [list, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating list:", err);
    next(err);
  }
}

export async function deleteList(req, res, next) {
  const { id } = req.params;
  try {
    // Check if the list has tasks, then delete them before deleting the list.
    const hasTasks = await pool.query(
      "SELECT * FROM tasks WHERE list_id = ($1);",
      [id]
    );
    if (hasTasks.rowCount > 0) {
      await pool.query("DELETE FROM tasks WHERE list_id = ($1);", [id]);
    }
    const result = await pool.query(
      "DELETE FROM lists WHERE id = ($1) RETURNING *;",
      [id]
    );
    res.status(200).json({
      success: true,
      message: "List deleted",
      deletedList: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting list:", err);
    next(err);
  }
}

export async function toggleListSelection(req, res, next) {
  console.log("✅ toggleListSelection route hit");
  const listID = Number(req.body.listId);
  if (isNaN(listID)) {
    return res.status(400).json({ error: "Invalid or missing list ID" });
  }

  const userId = req.user.id;

  try {
    const result = await pool.query(
      "UPDATE lists SET selected = NOT selected WHERE id = ($1) AND user_id = ($2) RETURNING *;",
      [listID, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "List not found or you don't have permission to update it",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error toggling list selection:", err);
    next(err);
  }
}
