import { Router, Request, Response } from "express";
import { IMenuItem } from "../models/IMenuItem";
import { IProductoPedido } from "../models/IProductoPedido";
import { IPedido } from "../models/IPedido";


const router = Router();

// ─── Datos en memoria ─────────────────────────────────────────────────────────

let menu: Record<string, IMenuItem> = {
    "Pizza Cool":  { stock: 10, precio: 1500 },
    "Hamburguesa": { stock: 5,  precio: 1200 },
    "Empanadas":   { stock: 20, precio: 800  },
    "Pomarola":    { stock: 5,  precio: 900  },
    "Cerveza":     { stock: 20, precio: 600  },
};

let pedidos: IPedido[] = [
    { id: 1, mesa: 1, productos: [{ nombre: "Pizza Cool",  cantidad: 1, precio: 1500 }], total: 1500, estado: "pendiente" },
    { id: 2, mesa: 2, productos: [{ nombre: "Cerveza",     cantidad: 2, precio: 600  }], total: 1200, estado: "pendiente" },
    { id: 3, mesa: 3, productos: [{ nombre: "Empanadas",   cantidad: 3, precio: 800  }, { nombre: "Cerveza", cantidad: 2, precio: 600 }], total: 3600, estado: "pendiente" },
    { id: 4, mesa: 4, productos: [{ nombre: "Hamburguesa", cantidad: 1, precio: 1200 }], total: 1200, estado: "pendiente" },
    { id: 5, mesa: 5, productos: [{ nombre: "Pomarola",    cantidad: 1, precio: 900  }], total: 900,  estado: "pendiente" },
];

let nextId: number = Math.max(...pedidos.map((p) => p.id)) + 1;

const calcularTotal = (productos: IProductoPedido[]): number =>
    productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);


// GET /pedidos — listar todos los pedidos
router.get("/", (_req: Request, res: Response) => {
    res.json(pedidos);
});

// POST /pedidos — crear un pedido con uno o más productos
router.post("/", (req: Request, res: Response) => {
    const { mesa, productos } = req.body as { mesa: unknown; productos: unknown };

    if (!mesa || typeof mesa !== "number") {
        return res.status(400).json({ error: "El campo 'mesa' es requerido y debe ser un número" });
    }

    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ error: "El campo 'productos' debe ser un array con al menos un elemento" });
    }

    const items = productos as Array<{ nombre?: unknown; cantidad?: unknown }>;

    // Validar todos los productos antes de tocar el stock
    for (const item of items) {
        if (!item.nombre || typeof item.nombre !== "string") {
            return res.status(400).json({ error: "Cada producto debe tener un campo 'nombre' de tipo string" });
        }
        if (typeof item.cantidad !== "number" || item.cantidad <= 0) {
            return res.status(400).json({ error: "Cada producto debe tener 'cantidad' mayor a 0" });
        }
        if (!menu[item.nombre]) {
            return res.status(404).json({ error: `El producto '${item.nombre}' no existe en el menú` });
        }
        if (menu[item.nombre].stock < item.cantidad) {
            return res.status(400).json({
                error: `No hay suficiente stock de '${item.nombre}'. Quedan: ${menu[item.nombre].stock}`,
            });
        }
    }

    const productosConPrecio: IProductoPedido[] = (items as Array<{ nombre: string; cantidad: number }>).map((item) => {
        menu[item.nombre].stock -= item.cantidad;
        return { nombre: item.nombre, cantidad: item.cantidad, precio: menu[item.nombre].precio };
    });

    const nuevoPedido: IPedido = {
        id: nextId++,
        mesa,
        productos: productosConPrecio,
        total: calcularTotal(productosConPrecio),
        estado: "pendiente",
    };
    pedidos.push(nuevoPedido);

    return res.status(201).json({
        mensaje: "Pedido realizado y stock actualizado",
        pedido: nuevoPedido,
    });
});

// DELETE /pedidos/:id/productos/:nombre — eliminar un producto de un pedido
router.delete("/:id/productos/:nombre", (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
const nombre = req.params.nombre as string;

    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) {
        return res.status(404).json({ error: `No se encontró el pedido con id ${id}` });
    }

    const indexProducto = pedido.productos.findIndex((p) => p.nombre === nombre);
    if (indexProducto === -1) {
        return res.status(404).json({ error: `El producto '${nombre}' no está en el pedido` });
    }

    const [productoEliminado] = pedido.productos.splice(indexProducto, 1);

    // Devolver stock al menú
    if (menu[nombre]) {
        menu[nombre].stock += productoEliminado.cantidad;
    }

    if (pedido.productos.length === 0) {
        pedidos = pedidos.filter((p) => p.id !== id);
        return res.json({
            mensaje: `Producto '${nombre}' eliminado. El pedido quedó vacío y fue eliminado.`,
        });
    }

    pedido.total = calcularTotal(pedido.productos);

    return res.json({
        mensaje: `Producto '${nombre}' eliminado del pedido`,
        pedido,
    });
});

// GET /pedidos/stock — consultar el stock actual de todos los productos
router.get("/stock", (_req: Request, res: Response) => {
    const listaMenu = Object.entries(menu).map(([nombre, { stock, precio }]) => ({
        producto: nombre,
        stock,
        precio,
    }));
    res.json(listaMenu);
});

export default router;
