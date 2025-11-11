// src/server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import questionRoutes from "./routes/question.routes.js";
import simulationRoutes from "./routes/simulation.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// 👇 IMPORTS CORRECTOS (dentro de src)
import Question from "./models/Question.js";
import { protect, isAdmin } from "./middleware/auth.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/simulations", simulationRoutes);
app.use("/api/admin", adminRoutes);

// Seed de preguntas (solo admin)
app.post("/api/seed-questions/seed", protect, isAdmin, async (req, res) => {
  try {
    const initialQuestions = [
      {
        text: "Cuéntame sobre ti y tu trayectoria académica en pocas palabras.",
        category: "comportamiento",
        level: "junior",
        tags: ["presentacion", "inicio"],
      },
      {
        text: "Descríbeme una situación en la que tuviste que trabajar en equipo para lograr un objetivo.",
        category: "comportamiento",
        level: "junior",
        tags: ["trabajo_en_equipo"],
      },
      {
        text: "Háblame de una ocasión en la que enfrentaste un reto académico o personal y cómo lo resolviste.",
        category: "comportamiento",
        level: "junior",
        tags: ["resolucion_de_problemas"],
      },
      {
        text: "Cuéntame de un error que hayas cometido en un proyecto y qué aprendiste de él.",
        category: "comportamiento",
        level: "junior",
        tags: ["autocritica", "aprendizaje"],
      },
      {
        text: "¿Cómo manejas la presión cuando tienes varias entregas o proyectos al mismo tiempo?",
        category: "comportamiento",
        level: "junior",
        tags: ["trabajo_bajo_presion"],
      },
      {
        text: "Dame un ejemplo de una situación donde tuviste que aprender algo nuevo rápido.",
        category: "comportamiento",
        level: "junior",
        tags: ["aprendizaje", "adaptabilidad"],
      },
      {
        text: "¿Cómo reaccionas cuando recibes retroalimentación negativa?",
        category: "comportamiento",
        level: "junior",
        tags: ["feedback", "actitud"],
      },
      {
        text: "¿Qué es lo más importante para ti en el ambiente de trabajo de una empresa?",
        category: "cultura",
        level: "junior",
        tags: ["cultura", "valores"],
      },
      {
        text: "¿Por qué te interesa trabajar en una empresa como la nuestra?",
        category: "cultura",
        level: "junior",
        tags: ["motivacion", "investigacion_empresa"],
      },
      {
        text: "¿Cómo te mantienes actualizado en tu área profesional?",
        category: "cultura",
        level: "junior",
        tags: ["proactividad", "aprendizaje_continuo"],
      },
      {
        text: "Explícame un proyecto escolar o personal del que te sientas orgulloso y cuál fue tu rol.",
        category: "tecnica",
        level: "junior",
        tags: ["proyectos", "explicacion_tecnica"],
      },
      {
        text: "Cuando no entiendes un problema técnico o funcional, ¿cuál es tu proceso para resolverlo?",
        category: "tecnica",
        level: "junior",
        tags: ["resolucion_de_problemas"],
      },
      {
        text: "¿Qué herramientas tecnológicas o plataformas utilizas con mayor confianza?",
        category: "tecnica",
        level: "junior",
        tags: ["herramientas"],
      },
      {
        text: "¿Has trabajado con metodologías ágiles, como Scrum o Kanban? Cuéntame tu experiencia.",
        category: "tecnica",
        level: "junior",
        tags: ["agil", "colaboracion"],
      },
      {
        text: "Explícame un concepto de tu carrera como si se lo explicaras a alguien que no es experto.",
        category: "tecnica",
        level: "junior",
        tags: ["comunicacion", "didactica"],
      },
      {
        text: "¿Qué es lo que más difícil se te hace en una entrevista de trabajo?",
        category: "diagnostico",
        level: "junior",
        tags: ["dificultades", "autoevaluacion"],
      },
      {
        text: "Antes de esta plataforma, ¿qué hacías para prepararte para una entrevista?",
        category: "diagnostico",
        level: "junior",
        tags: ["habitos", "preparacion"],
      },
      {
        text: "En una escala del 1 al 10, ¿qué tan seguro te sientes al responder preguntas imprevistas?",
        category: "diagnostico",
        level: "junior",
        tags: ["confianza"],
      },
      {
        text: "¿Te cuesta más hablar de tus logros, de tus errores o de tus habilidades blandas? ¿Por qué?",
        category: "diagnostico",
        level: "junior",
        tags: ["autoconocimiento"],
      },
      {
        text: "Cuéntame de una ocasión en la que ayudaste a alguien del equipo a cumplir una tarea difícil.",
        category: "comportamiento",
        level: "junior",
        tags: ["colaboracion"],
      },
      {
        text: "Descríbeme una situación donde tuviste que organizar tu tiempo para cumplir con varios compromisos.",
        category: "comportamiento",
        level: "junior",
        tags: ["gestion_del_tiempo"],
      },
      {
        text: "¿Cómo manejas los conflictos con compañeros o líderes?",
        category: "comportamiento",
        level: "junior",
        tags: ["conflictos", "comunicacion"],
      },
      {
        text: "¿Cómo te aseguras de entregar trabajo de calidad aun con fechas de entrega ajustadas?",
        category: "tecnica",
        level: "junior",
        tags: ["calidad", "responsabilidad"],
      },
      {
        text: "Cuéntame de una vez que investigaste por tu cuenta para resolver algo que no sabías.",
        category: "tecnica",
        level: "junior",
        tags: ["investigacion", "autonomia"],
      },
      {
        text: "¿Dónde te ves profesionalmente en los próximos 2 a 3 años?",
        category: "cultura",
        level: "junior",
        tags: ["vision", "planes"],
      },
      {
        text: "¿Por qué deberíamos considerarte para esta posición de entrada / trainee?",
        category: "cultura",
        level: "junior",
        tags: ["propuesta_valor"],
      },
      {
        text: "Si pudieras mejorar un aspecto de tu desempeño en entrevistas, ¿cuál sería?",
        category: "diagnostico",
        level: "junior",
        tags: ["mejora_continua"],
      },
    ];

    await Question.deleteMany({});
    const inserted = await Question.insertMany(initialQuestions);

    return res.json({
      message: "Preguntas iniciales creadas correctamente",
      count: inserted.length,
    });
  } catch (error) {
    console.error("Error al sembrar preguntas:", error);
    return res
      .status(500)
      .json({ message: "Error al sembrar preguntas" });
  }
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API Orientador de Entrevistas funcionando 🚀" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
