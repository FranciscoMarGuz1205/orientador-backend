import { Router } from "express";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getQuestions);
router.post("/", protect, isAdmin, createQuestion);
router.put("/:id", protect, isAdmin, updateQuestion);
router.delete("/:id", protect, isAdmin, deleteQuestion);

export default router;
