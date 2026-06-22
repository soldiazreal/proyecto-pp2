import { Router } from "express";
import { MesaController } from "../controllers/mesaControllers";
import { PedidoController } from "../controllers/pedidoControllers";
import { PlatoController } from "../controllers/platoControllers";
import {
  validateCreateMesa,
  validateMesaId,
  validateUpdateMesa,
  validateCreatePedido,
  validateUpdatePedido,
  validatePedidoId,
  validateMesaIdParam,
  validateCreatePlato,
  validatePlatoId,
  validateUpdatePlato,
  validateBulkDelete,
  validateBulkDeletePlatos,
} from "../middlewares/validators";

const router = Router();

/** MESAS */

router.get("/mesas", MesaController.getMesas);
router.get("/mesas/:id", validateMesaId, MesaController.getMesaById);
router.post("/mesas", validateCreateMesa, MesaController.createMesa);
router.post(
  "/mesas/deletemany",
  validateBulkDelete,
  MesaController.deleteMultipleMesas,
);
router.put("/mesas/:id", validateUpdateMesa, MesaController.updateMesa);
router.delete("/mesas/:id", validateMesaId, MesaController.deleteMesa);

/** PEDIDOS */

router.get("/pedidos", PedidoController.getPedidos);
router.get("/pedidos/:id", validatePedidoId, PedidoController.getPedidoById);
router.get(
  "/mesas/:mesaId/pedidos",
  validateMesaIdParam,
  PedidoController.getPedidosByMesaId,
);
router.post("/pedidos", validateCreatePedido, PedidoController.createPedido);
router.put("/pedidos/:id", validateUpdatePedido, PedidoController.updatePedido);
router.delete("/pedidos/:id", validatePedidoId, PedidoController.deletePedido);

/** PLATOS */

router.get("/platos", PlatoController.getPlatos);
router.get("/platos/:id", validatePlatoId, PlatoController.getPlatoById);
router.post("/platos", validateCreatePlato, PlatoController.createPlato);
router.put("/platos/:id", validateUpdatePlato, PlatoController.updatePlato);
router.delete("/platos/:id", validatePlatoId, PlatoController.deletePlato);
router.post(
  "/platos/deletemany",
  validateBulkDeletePlatos,
  PlatoController.deleteMultiplePlatos,
);

export default router;