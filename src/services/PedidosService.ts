import { IPedido } from "../models/IPedido";
import { IProductoPedido } from "../models/IProductoPedido";
import * as MenuService from "./MenuService";

// ─── Estado en memoria ────────────────────────────────────────────────────────

const PEDIDOS_INICIALES: IPedido[] = [
    { id: 1, mesa: 1, productos: [{ nombre: "Pizza Cool",  cantidad: 1, precio: 1500 }], total: 1500, estado: "pendiente" },
    { id: 2, mesa: 2, productos: [{ nombre: "Cerveza",     cantidad: 2, precio: 600  }], total: 1200, estado: "pendiente" },
    { id: 3, mesa: 3, productos: [{ nombre: "Empanadas",   cantidad: 3, precio: 800  }, { nombre: "Cerveza", cantidad: 2, precio: 600 }], total: 3600, estado: "pendiente" },
    { id: 4, mesa: 4, productos: [{ nombre: "Hamburguesa", cantidad: 1, precio: 1200 }], total: 1200, estado: "pendiente" },
    { id: 5, mesa: 5, productos: [{ nombre: "Pomarola",    cantidad: 1, precio: 900  }], total: 900,  estado: "pendiente" },
];

let pedidos: IPedido[] = PEDIDOS_INICIALES.map((p) => ({
    ...p,
    productos: p.productos.map((prod) => ({ ...prod })),
}));

let nextId: number = Math.max(...pedidos.map((p) => p.id)) + 1;

export const resetState = (): void => {
    pedidos = PEDIDOS_INICIALES.map((p) => ({
        ...p,
        productos: p.productos.map((prod) => ({ ...prod })),
    }));
    nextId = Math.max(...pedidos.map((p) => p.id)) + 1;
    MenuService.resetState();
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const calcularTotal = (productos: IProductoPedido[]): number =>
    productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

// ─── Consultas ────────────────────────────────────────────────────────────────

export const getPedidos = (): IPedido[] => pedidos;

export const getPedidoById = (id: number): IPedido | undefined =>
    pedidos.find((p) => p.id === id);

// ─── Mutaciones ───────────────────────────────────────────────────────────────

/**
 * Crea un pedido validando stock y descontándolo vía MenuService.
 * Lanza Error con mensaje descriptivo ante cualquier problema.
 */
export const crearPedido = (
    mesa: number,
    items: Array<{ nombre: string; cantidad: number }>
): IPedido => {
    // Validar todo antes de tocar el estado
    for (const item of items) {
        if (!MenuService.existeProducto(item.nombre)) {
            throw new Error(`El producto '${item.nombre}' no existe en el menú`);
        }
        if (!MenuService.hayStock(item.nombre, item.cantidad)) {
            const producto = MenuService.getProducto(item.nombre)!;
            throw new Error(
                `No hay suficiente stock de '${item.nombre}'. Quedan: ${producto.stock}`
            );
        }
    }

    // Descontar stock y construir productos con precio
    const productosConPrecio: IProductoPedido[] = items.map((item) => {
        const producto = MenuService.getProducto(item.nombre)!;
        MenuService.removeStock(item.nombre, item.cantidad);
        return { nombre: item.nombre, cantidad: item.cantidad, precio: producto.precio };
    });

    const nuevoPedido: IPedido = {
        id: nextId++,
        mesa,
        productos: productosConPrecio,
        total: calcularTotal(productosConPrecio),
        estado: "pendiente",
    };

    pedidos.push(nuevoPedido);
    return nuevoPedido;
};

/**
 * Elimina un producto de un pedido y devuelve el stock al menú.
 * Si el pedido queda vacío, lo elimina también.
 */
export const eliminarProductoDePedido = (
    id: number,
    nombre: string
): { pedido: IPedido | null; pedidoEliminado: boolean } => {
    const pedido = getPedidoById(id);
    if (!pedido) {
        throw new Error(`No se encontró el pedido con id ${id}`);
    }

    const indexProducto = pedido.productos.findIndex((p) => p.nombre === nombre);
    if (indexProducto === -1) {
        throw new Error(`El producto '${nombre}' no está en el pedido`);
    }

    const [productoEliminado] = pedido.productos.splice(indexProducto, 1);

    // Devolver stock al menú
    MenuService.addStock(nombre, productoEliminado.cantidad);

    if (pedido.productos.length === 0) {
        pedidos = pedidos.filter((p) => p.id !== id);
        return { pedido: null, pedidoEliminado: true };
    }

    pedido.total = calcularTotal(pedido.productos);
    return { pedido, pedidoEliminado: false };
};
