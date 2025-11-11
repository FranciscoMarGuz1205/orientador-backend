// src/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ message: "El correo ya está registrado." });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      message: "Usuario registrado correctamente.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res
      .status(500)
      .json({ message: "Error al registrar usuario." });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(400)
        .json({ message: "Credenciales inválidas." });
    }

    return res.json({
      message: "Login exitoso.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res
      .status(500)
      .json({ message: "Error al iniciar sesión." });
  }
};

// GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "No autorizado." });
    }

    return res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    console.error("Error en getProfile:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener perfil." });
  }
};
