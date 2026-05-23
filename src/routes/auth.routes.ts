import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
  res.json({
    success: true,
    token: "123456"
    
  });
});

export default router;