import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json([
    {
      id: "1",
      nombre: "Juan"
    },
    {
      id: "2",
      nombre: "María"
    }
  ]);
});

export default router;