import { Router } from "express";
import { MesaController } from "../controllers/mesaControllers";

const router = Router();

router.get("/mesas", MesaController.getMesas);
router.get("/mesas/:id", MesaController.getMesaById);
router.post("/mesas", MesaController.createMesa);
router.put("/mesas/:id", MesaController.updateMesa);
router.delete("/mesas/:id", MesaController.deleteMesa);

export default router;