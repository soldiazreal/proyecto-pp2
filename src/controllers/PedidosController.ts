import { Router, Request, Response } from "express";
import * as PedidosService from "../services/PedidosService";

const router = Router();

// GET /pedidos — listar todos los pedidos
router.get("/", (_req: Request, res: Response) => {
    res.json(PedidosService.getPedidos());
});

// POST /pedidos — crear un pedido con uno o más productos
// Body: { mesa: number, productos: Array<{ nombre: string, cantidad: number }> }
router.post("/", (req: Request, res: Response) => {
    const { mesa, productos } = req.body as { mesa: unknown; productos: unknown };

    if (!mesa || typeof mesa !== "number") {
        return res.status(400).json({ error: "El campo 'mesa' es requerido y debe ser un número" });
    }
    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ error: "El campo 'productos' debe ser un array con al menos un elemento" });
    }

    const items = productos as Array<{ nombre?: unknown; cantidad?: unknown }>;

    for (const item of items) {
        if (!item.nombre || typeof item.nombre !== "string") {
            return res.status(400).json({ error: "Cada producto debe tener un campo 'nombre' de tipo string" });
        }
        if (typeof item.cantidad !== "number" || item.cantidad <= 0) {
            return res.status(400).json({ error: "Cada producto debe tener 'cantidad' mayor a 0" });
        }
    }

    try {
        const pedido = PedidosService.crearPedido(
            mesa,
            items as Array<{ nombre: string; cantidad: number }>
        );
        return res.status(201).json({ mensaje: "Pedido realizado y stock actualizado", pedido });
    } catch (err) {
        const message = (err as Error).message;
        const status = message.includes("no existe") ? 404 : 400;
        return res.status(status).json({ error: message });
    }
});

// DELETE /pedidos/:id/productos/:nombre — eliminar un producto de un pedido
router.delete("/:id/productos/:nombre", (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const nombre = req.params.nombre as string;

    if (isNaN(id)) {
        return res.status(400).json({ error: "El parámetro 'id' debe ser un número válido" });
    }

    try {
        const { pedido, pedidoEliminado } = PedidosService.eliminarProductoDePedido(id, nombre);

        if (pedidoEliminado) {
            return res.json({
                mensaje: `Producto '${nombre}' eliminado. El pedido quedó vacío y fue eliminado.`,
            });
        }

        return res.json({ mensaje: `Producto '${nombre}' eliminado del pedido`, pedido });
    } catch (err) {
        return res.status(404).json({ error: (err as Error).message });
    }
});

export default router;
