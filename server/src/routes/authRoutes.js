import express from "express";
import { register, login, logout, refreshToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.post("/token", refreshToken);

export default router;