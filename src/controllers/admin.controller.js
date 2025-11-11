// src/controllers/admin.controller.js
import User from "../models/User.js";
import Question from "../models/Question.js";
import Simulation from "../models/Simulation.js";

/* ========== USUARIOS ========== */

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error getAllUsers:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    console.error("Error getUserById:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Rol actualizado", user });
  } catch (error) {
    console.error("Error updateUserRole:", error);
    res.status(500).json({ message: "Error al actualizar rol" });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error deleteUser:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

/* ========== PREGUNTAS ========== */

// GET /api/admin/questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error("Error getAllQuestions:", error);
    res.status(500).json({ message: "Error al obtener preguntas" });
  }
};

// POST /api/admin/questions
export const createQuestion = async (req, res) => {
  try {
    const { text, category, level, tags } = req.body;

    if (!text || !category) {
      return res
        .status(400)
        .json({ message: "Texto y categoría son obligatorios" });
    }

    const question = await Question.create({
      text,
      category,
      level: level || "junior",
      tags: tags || [],
    });

    res.status(201).json({ message: "Pregunta creada", question });
  } catch (error) {
    console.error("Error createQuestion:", error);
    res.status(500).json({ message: "Error al crear pregunta" });
  }
};

// PUT /api/admin/questions/:id
export const updateQuestion = async (req, res) => {
  try {
    const { text, category, level, tags } = req.body;

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { text, category, level, tags },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }

    res.json({ message: "Pregunta actualizada", question });
  } catch (error) {
    console.error("Error updateQuestion:", error);
    res.status(500).json({ message: "Error al actualizar pregunta" });
  }
};

// DELETE /api/admin/questions/:id
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }

    res.json({ message: "Pregunta eliminada" });
  } catch (error) {
    console.error("Error deleteQuestion:", error);
    res.status(500).json({ message: "Error al eliminar pregunta" });
  }
};

/* ========== SIMULACIONES ========== */

// GET /api/admin/simulations
export const getAllSimulations = async (req, res) => {
  try {
    const sims = await Simulation.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(sims);
  } catch (error) {
    console.error("Error getAllSimulations:", error);
    res.status(500).json({ message: "Error al obtener simulaciones" });
  }
};

// DELETE /api/admin/simulations/:id
export const deleteSimulation = async (req, res) => {
  try {
    const sim = await Simulation.findByIdAndDelete(req.params.id);
    if (!sim) {
      return res.status(404).json({ message: "Simulación no encontrada" });
    }

    res.json({ message: "Simulación eliminada" });
  } catch (error) {
    console.error("Error deleteSimulation:", error);
    res.status(500).json({ message: "Error al eliminar simulación" });
  }
};
