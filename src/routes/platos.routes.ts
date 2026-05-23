import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json([
    {
      id: "1",
      nombre: "Pizza"
    },
    {
      id: "2",
      nombre: "Hamburguesa"
    }
  ]);
});

export default router;