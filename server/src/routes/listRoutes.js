import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  getLists,
  createList,
  updateList,
  deleteList,
  toggleListSelection,
} from "../controllers/listController.js";

const router = express.Router();

router.get("/", authenticateToken, getLists);
router.post("/", authenticateToken, createList);
router.patch("/:id", authenticateToken, updateList);
router.delete("/:id", authenticateToken, deleteList);
router.patch("/selected", authenticateToken, toggleListSelection);

export default router;
