// src/middleware/auth.middleware.js
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No autorizado, falta token" });
    }

    const token = header.split(" ")[1];

    // Usa la variable correcta según tu .env
    const secret =
      process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || process.env._SECRET;

    if (!secret) {
      console.error("❌ No hay secreto JWT configurado");
      return res
        .status(500)
        .json({ message: "Error en el servidor: falta configuración de JWT." });
    }

    const decoded = jwt.verify(token, secret);

    // aquí guardamos el id del usuario
    req.user = { id: decoded.id || decoded._id || decoded.userId };

    if (!req.user.id) {
      return res.status(401).json({ message: "Token inválido (sin usuario)" });
    }

    next();
  } catch (error) {
    console.error("❌ Error en authMiddleware:", error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
