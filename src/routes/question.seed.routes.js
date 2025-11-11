import { Router } from "express";

const router = Router();

console.log("✅ question.seed.routes CARGADO");

router.get("/ping", (req, res) => {
  return res.json({ ok: true, message: "seed routes OK" });
});

export default router;
