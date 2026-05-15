import * as PedidosService from "../PedidosService";
import * as MenuService from "../MenuService";

beforeEach(() => {
    PedidosService.resetState(); // también resetea MenuService internamente
});

describe("getPedidos", () => {
    it("devuelve la lista de pedidos iniciales", () => {
        const pedidos = PedidosService.getPedidos();
        expect(pedidos.length).toBe(5);
    });

    it("cada pedido tiene id, mesa, productos, total y estado", () => {
        for (const pedido of PedidosService.getPedidos()) {
            expect(pedido).toHaveProperty("id");
            expect(pedido).toHaveProperty("mesa");
            expect(pedido).toHaveProperty("productos");
            expect(pedido).toHaveProperty("total");
            expect(pedido).toHaveProperty("estado");
        }
    });
});

describe("getPedidoById", () => {
    it("devuelve el pedido correcto por id", () => {
        const pedido = PedidosService.getPedidoById(1);
        expect(pedido).toBeDefined();
        expect(pedido!.id).toBe(1);
    });

    it("devuelve undefined si el id no existe", () => {
        expect(PedidosService.getPedidoById(999)).toBeUndefined();
    });
});

describe("crearPedido", () => {
    it("crea un pedido con el total calculado correctamente", () => {
        const pedido = PedidosService.crearPedido(10, [
            { nombre: "Empanadas", cantidad: 2 }, // 800 * 2 = 1600
            { nombre: "Cerveza",   cantidad: 3 }, // 600 * 3 = 1800
        ]);
        expect(pedido.total).toBe(3400);
    });

    it("asigna el precio del menú al momento de crear el pedido", () => {
        const pedido = PedidosService.crearPedido(10, [{ nombre: "Pizza Cool", cantidad: 1 }]);
        expect(pedido.productos[0].precio).toBe(1500);
    });

    it("el pedido creado tiene estado 'pendiente'", () => {
        const pedido = PedidosService.crearPedido(10, [{ nombre: "Cerveza", cantidad: 1 }]);
        expect(pedido.estado).toBe("pendiente");
    });

    it("el pedido aparece en getPedidos después de crearlo", () => {
        const pedido = PedidosService.crearPedido(10, [{ nombre: "Cerveza", cantidad: 1 }]);
        const encontrado = PedidosService.getPedidoById(pedido.id);
        expect(encontrado).toBeDefined();
    });

    it("cada pedido nuevo recibe un id único e incremental", () => {
        const p1 = PedidosService.crearPedido(10, [{ nombre: "Cerveza", cantidad: 1 }]);
        const p2 = PedidosService.crearPedido(11, [{ nombre: "Cerveza", cantidad: 1 }]);
        expect(p2.id).toBe(p1.id + 1);
    });

    it("descuenta el stock del menú al crear el pedido", () => {
        const stockAntes = MenuService.getProducto("Hamburguesa")!.stock;
        PedidosService.crearPedido(10, [{ nombre: "Hamburguesa", cantidad: 2 }]);
        expect(MenuService.getProducto("Hamburguesa")!.stock).toBe(stockAntes - 2);
    });

    it("lanza error si el producto no existe en el menú", () => {
        expect(() =>
            PedidosService.crearPedido(10, [{ nombre: "Sushi", cantidad: 1 }])
        ).toThrow(/no existe/i);
    });

    it("lanza error si no hay stock suficiente", () => {
        expect(() =>
            PedidosService.crearPedido(10, [{ nombre: "Pomarola", cantidad: 999 }])
        ).toThrow(/stock/i);
    });

    it("no descuenta stock de ningún producto si uno del pedido falla", () => {
        const stockAntes = MenuService.getProducto("Empanadas")!.stock;
        try {
            PedidosService.crearPedido(10, [
                { nombre: "Empanadas", cantidad: 2 },
                { nombre: "Producto Inexistente", cantidad: 1 },
            ]);
        } catch (_) {}
        expect(MenuService.getProducto("Empanadas")!.stock).toBe(stockAntes);
    });
});

describe("eliminarProductoDePedido", () => {
    it("elimina el producto del pedido correctamente", () => {
        PedidosService.eliminarProductoDePedido(3, "Cerveza");
        const pedido = PedidosService.getPedidoById(3)!;
        expect(pedido.productos.find((p) => p.nombre === "Cerveza")).toBeUndefined();
    });

    it("devuelve el stock del producto eliminado al menú", () => {
        const stockAntes = MenuService.getProducto("Cerveza")!.stock;
        const pedido = PedidosService.getPedidoById(3)!;
        const cantidad = pedido.productos.find((p) => p.nombre === "Cerveza")!.cantidad;

        PedidosService.eliminarProductoDePedido(3, "Cerveza");

        expect(MenuService.getProducto("Cerveza")!.stock).toBe(stockAntes + cantidad);
    });

    it("recalcula el total del pedido tras eliminar un producto", () => {
        // Pedido 3: Empanadas(3 * 800 = 2400) + Cerveza(2 * 600 = 1200) = 3600
        PedidosService.eliminarProductoDePedido(3, "Cerveza");
        const pedido = PedidosService.getPedidoById(3)!;
        expect(pedido.total).toBe(2400);
    });

    it("elimina el pedido completo si queda sin productos", () => {
        const { pedidoEliminado } = PedidosService.eliminarProductoDePedido(1, "Pizza Cool");
        expect(pedidoEliminado).toBe(true);
        expect(PedidosService.getPedidoById(1)).toBeUndefined();
    });

    it("devuelve pedidoEliminado false si aún quedan productos", () => {
        const { pedidoEliminado } = PedidosService.eliminarProductoDePedido(3, "Cerveza");
        expect(pedidoEliminado).toBe(false);
    });

    it("lanza error si el pedido no existe", () => {
        expect(() =>
            PedidosService.eliminarProductoDePedido(999, "Cerveza")
        ).toThrow(/pedido/i);
    });

    it("lanza error si el producto no está en el pedido", () => {
        expect(() =>
            PedidosService.eliminarProductoDePedido(1, "Sushi")
        ).toThrow(/producto/i);
    });
});
