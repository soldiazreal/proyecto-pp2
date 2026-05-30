import { Router } from "express";
import { PedidoController } from "../controllers/pedidoControllers";
const router = Router();

router.get("/pedidos", PedidoController.getPedidos);
router.get("/pedidos/:id", PedidoController.getPedidoById);
router.get("/mesas/:mesaId/pedidos", PedidoController.getPedidosByMesaId);
router.post("/pedidos", PedidoController.createPedido);
router.put("/pedidos/:id", PedidoController.updatePedido);
router.delete("/pedidos/:id", PedidoController.deletePedido);

export default router;
