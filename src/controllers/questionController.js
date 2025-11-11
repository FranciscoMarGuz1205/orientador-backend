// backend/src/controllers/questionController.js
import Question from "../models/Question.js";

// Obtener todas las preguntas
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error("Error al obtener preguntas:", error);
    res.status(500).json({ message: "Error al obtener preguntas" });
  }
};

// Crear una nueva pregunta
export const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    console.error("Error al crear pregunta:", error);
    res.status(500).json({ message: "Error al crear pregunta" });
  }
};

// Actualizar una pregunta
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar pregunta:", error);
    res.status(500).json({ message: "Error al actualizar pregunta" });
  }
};

// Eliminar una pregunta
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Question.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }
    res.json({ message: "Pregunta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar pregunta:", error);
    res.status(500).json({ message: "Error al eliminar pregunta" });
  }
};
