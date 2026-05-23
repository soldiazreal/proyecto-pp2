import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json([
    {
      id: "1",
      nombre: "Salón Principal",
      capacidad: 60
    },
    {
      id: "2",
      nombre: "Salón VIP",
      capacidad: 30
    }
  ]);
});

export default router;