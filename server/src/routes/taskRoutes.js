import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", authenticateToken, getTasks);
router.post("/", authenticateToken, createTask);
router.patch("/:id", authenticateToken, updateTask);
router.delete("/:id", authenticateToken, deleteTask);

export default router;
