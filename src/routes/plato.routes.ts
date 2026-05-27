import { Router } from "express";
import { PlatoController } from "../controllers/platoControllers";
const router = Router();

router.get("/platos/:id" , PlatoController.getPlatoById);
router.get("/platos" , PlatoController.getPlatos);

router.post("/platos", PlatoController.createPlato);

export default router;