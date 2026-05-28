import { Router } from "express";
import { MesaController } from "../controllers/mesaControllers";
import { PedidoController } from "../controllers/pedidoControllers";
const router = Router();

/** Pedidos */
router.get("/pedidos", PedidoController.getPedidos);
router.get("/pedidos/:id", PedidoController.getPedidoById);
router.get("/mesas/:mesaId/pedidos", PedidoController.getPedidosByMesaId);
router.post("/pedidos", PedidoController.createPedido);
router.put("/pedidos/:id", PedidoController.updatePedido);
router.delete("/pedidos/:id", PedidoController.deletePedido);

/** Mesas */
router.get("/mesas", MesaController.getMesas);
router.post("/mesas/create", MesaController.createMesa);

export default router;
