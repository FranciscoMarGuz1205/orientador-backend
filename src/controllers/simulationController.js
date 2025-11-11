// src/controllers/simulationController.js
import Simulation from "../models/Simulation.js";
import Question from "../models/Question.js";

/**
 * Evalúa una respuesta considerando:
 * - Longitud mínima
 * - Estructura STAR (Situación, Acción, Resultado)
 * - Claridad / uso en primera persona
 * - Reflexión / aprendizaje
 */
function evaluateAnswer(text) {
  const comments = [];

  if (!text || !text.trim()) {
    comments.push(
      "La respuesta está vacía. Intenta siempre responder con un ejemplo concreto."
    );
    return { score: 0, comments };
  }

  const clean = text.trim().toLowerCase();
  const words = clean.split(/\s+/);
  let score = 0;

  // 1️⃣ Longitud (máx 40 pts)
  if (words.length < 15) {
    score += 10;
    comments.push(
      "La respuesta es muy breve. Desarrolla más la situación, tus acciones y el resultado."
    );
  } else if (words.length < 35) {
    score += 25;
  } else {
    score += 40;
    comments.push("Buena profundidad en la respuesta.");
  }

  // 2️⃣ Estructura STAR (máx 40 pts)
  let starHits = 0;

  if (
    clean.includes("situación") ||
    clean.includes("contexto") ||
    clean.includes("problema")
  ) {
    starHits++;
  }

  if (
    clean.includes("acción") ||
    clean.includes("acciones") ||
    clean.includes("lo que hice") ||
    clean.includes("me encargué")
  ) {
    starHits++;
  }

  if (
    clean.includes("resultado") ||
    clean.includes("logré") ||
    clean.includes("conseguimos") ||
    clean.includes("impacto")
  ) {
    starHits++;
  }

  if (starHits === 3) {
    score += 40;
    comments.push(
      "Excelente estructura: explicas la situación, tus acciones y el resultado (STAR)."
    );
  } else if (starHits === 2) {
    score += 25;
    comments.push(
      "Buena estructura, pero puedes hacer más claro el resultado o tus acciones específicas."
    );
  } else if (starHits === 1) {
    score += 10;
    comments.push(
      "Tocas solo una parte de la estructura STAR. Intenta incluir situación, acción y resultado."
    );
  } else {
    comments.push(
      "Intenta usar la estructura STAR: Situación, Acción y Resultado para dar respuestas más sólidas."
    );
  }

  // 3️⃣ Claridad / protagonismo (máx 5 pts)
  if (/(yo|me|mi|nosotros)/.test(clean)) {
    score += 5;
    comments.push(
      "Dejas claro tu rol personal en la situación, eso es positivo."
    );
  }

  // 4️⃣ Reflexión / aprendizaje (máx 10 pts)
  if (/(aprendí|mejoré|me di cuenta|para la próxima)/.test(clean)) {
    score += 10;
    comments.push(
      "Muestras reflexión y aprendizaje, eso es muy valorado en entrevistas."
    );
  }

  if (score > 100) score = 100;

  return { score, comments };
}

/**
 * POST /api/simulations/start
 * Genera una simulación con 10 preguntas aleatorias.
 */
export const startSimulation = async (req, res) => {
  try {
    const total = await Question.countDocuments();

    if (total < 10) {
      return res.status(400).json({
        message:
          "No hay suficientes preguntas registradas. Se requieren al menos 10 para iniciar una simulación.",
      });
    }

    const size = 10; // ✅ mínimo 10 preguntas por simulación

    const randomQuestions = await Question.aggregate([
      { $sample: { size } },
    ]);

    const simulation = await Simulation.create({
      user: req.user._id,
      questions: randomQuestions.map((q) => ({
        question: q._id,
        text: q.text,
      })),
    });

    return res.status(201).json({
      simulationId: simulation._id,
      questions: simulation.questions.map((q, index) => ({
        questionId: q.question,
        text: q.text,
        index: index + 1,
      })),
    });
  } catch (error) {
    console.error("Error al iniciar simulación:", error);
    return res
      .status(500)
      .json({ message: "Error al iniciar la simulación." });
  }
};

/**
 * POST /api/simulations/:id/finish
 * Recibe respuestas, evalúa y genera score + feedback.
 * Body: { answers: [ { questionId, answer } ] }
 */
export const finishSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const simulation = await Simulation.findById(id);

    if (!simulation) {
      return res
        .status(404)
        .json({ message: "Simulación no encontrada." });
    }

    // (Opcional) Si quieres validar que solo el dueño pueda finalizar:
    // if (simulation.user?.toString() !== req.user._id.toString()) {
    //   return res
    //     .status(403)
    //     .json({ message: "No tienes permiso para esta simulación." });
    // }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        message: "Debes enviar al menos una respuesta.",
      });
    }

    let totalScore = 0;
    const globalComments = [];

    simulation.answers = answers.map((a) => {
      const { score, comments } = evaluateAnswer(a.answer || "");
      totalScore += score;
      globalComments.push(...comments);

      return {
        question: a.questionId,
        answer: a.answer || "",
      };
    });

    const avg =
      simulation.answers.length > 0
        ? Math.round(totalScore / simulation.answers.length)
        : 0;

    simulation.score = avg;

    // Feedback general basado en el promedio
    if (avg < 60) {
      simulation.feedback =
        "Tu nivel de respuesta aún es básico. Practica usar ejemplos más completos y la estructura STAR.";
    } else if (avg < 80) {
      simulation.feedback =
        "Buen desempeño. Tus respuestas van bien, pero puedes reforzar resultados concretos y aprendizajes claros.";
    } else {
      simulation.feedback =
        "Excelente desempeño. Tus respuestas son claras, estructuradas y demuestran reflexión profesional.";
    }

    // Añadir comentarios únicos adicionales
    if (globalComments.length) {
      const unique = [...new Set(globalComments)];
      simulation.feedback += " " + unique.join(" ");
    }

    await simulation.save();

    return res.json({
      message: "Simulación finalizada correctamente.",
      score: simulation.score,
      feedback: simulation.feedback,
    });
  } catch (error) {
    console.error("Error al finalizar simulación:", error);
    return res
      .status(500)
      .json({ message: "Error al finalizar la simulación." });
  }
};

/**
 * GET /api/simulations/my
 * Historial de simulaciones del usuario
 */
export const getMySimulations = async (req, res) => {
  try {
    const sims = await Simulation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("score feedback createdAt");

    return res.json(sims);
  } catch (error) {
    console.error("Error al obtener simulaciones:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener simulaciones." });
  }
};
