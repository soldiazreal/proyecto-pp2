import { Router, Request, Response } from "express";
import * as MenuService from "../services/MenuService";

const router = Router();

// GET /menu — listar todos los productos con precio y stock
router.get("/", (_req: Request, res: Response) => {
    res.json(MenuService.getMenu());
});

// POST /menu — agregar un producto nuevo al menú
// Body: { nombre: string, stock: number, precio: number }
router.post("/", (req: Request, res: Response) => {
    const { nombre, stock, precio } = req.body as {
        nombre: unknown;
        stock: unknown;
        precio: unknown;
    };

    if (!nombre || typeof nombre !== "string") {
        return res.status(400).json({ error: "El campo 'nombre' es requerido y debe ser un string" });
    }
    if (typeof stock !== "number" || stock < 0) {
        return res.status(400).json({ error: "El campo 'stock' debe ser un número mayor o igual a 0" });
    }
    if (typeof precio !== "number" || precio <= 0) {
        return res.status(400).json({ error: "El campo 'precio' debe ser un número mayor a 0" });
    }

    try {
        const producto = MenuService.addProducto(nombre, stock, precio);
        return res.status(201).json({ mensaje: "Producto agregado al menú", producto });
    } catch (err) {
        return res.status(409).json({ error: (err as Error).message });
    }
});

// PATCH /menu/:nombre/stock/add — sumar stock a un producto existente
// Body: { cantidad: number }
router.patch("/:nombre/stock/add", (req: Request, res: Response) => {
    const nombre = req.params.nombre as string;
    const { cantidad } = req.body as { cantidad: unknown };

    if (typeof cantidad !== "number" || cantidad <= 0) {
        return res.status(400).json({ error: "El campo 'cantidad' debe ser un número mayor a 0" });
    }

    try {
        const producto = MenuService.addStock(nombre, cantidad);
        return res.json({ mensaje: `Stock de '${nombre}' actualizado`, producto });
    } catch (err) {
        return res.status(404).json({ error: (err as Error).message });
    }
});

export default router;
