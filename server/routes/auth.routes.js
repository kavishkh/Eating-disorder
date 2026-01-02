import express from "express";
import { register, login, me, updateProgress } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.post("/update-progress", protect, updateProgress);

export default router;
