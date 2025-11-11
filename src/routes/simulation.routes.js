// backend/src/routes/simulation.routes.js

import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  startSimulation,
  finishSimulation,
  getMySimulations,
} from "../controllers/simulationController.js";

const router = Router();

// Iniciar simulación (10 preguntas)
router.post("/start", protect, startSimulation);

// Finalizar simulación y evaluar respuestas
router.post("/:id/finish", protect, finishSimulation);

// Historial de simulaciones del usuario
router.get("/my", protect, getMySimulations);

export default router;
