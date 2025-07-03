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

router.patch("/selected", authenticateToken, toggleListSelection);

router.patch("/:id", authenticateToken, updateList);
router.delete("/:id", authenticateToken, deleteList);


export default router;
