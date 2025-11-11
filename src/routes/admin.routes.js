// src/routes/admin.routes.js
import { Router } from "express";
import { protect, isAdmin } from "../middleware/auth.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAllSimulations,
  deleteSimulation,
} from "../controllers/admin.controller.js";

const router = Router();

// Todas las rutas requieren admin
router.use(protect, isAdmin);

/* USUARIOS */
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

/* PREGUNTAS */
router.get("/questions", getAllQuestions);
router.post("/questions", createQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

/* SIMULACIONES */
router.get("/simulations", getAllSimulations);
router.delete("/simulations/:id", deleteSimulation);

export default router;
