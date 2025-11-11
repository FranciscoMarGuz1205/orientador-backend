// src/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Usuario no encontrado. Inicia sesión de nuevo." });
      }

      return next();
    } catch (error) {
      console.error("Error en protect:", error);
      return res
        .status(401)
        .json({ message: "Token inválido o expirado." });
    }
  }

  return res
    .status(401)
    .json({ message: "No autorizado, token no proporcionado." });
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Acceso denegado. Requiere rol administrador." });
};
