import request from "supertest";
import app from "../../app";
import * as PedidosService from "../../services/PedidosService";

jest.mock("../services/PedidosService");

const pedidosMock = [
    { id: 1, mesa: 1, productos: [{ nombre: "Pizza Cool",  cantidad: 1, precio: 1500 }], total: 1500, estado: "pendiente" },
    { id: 2, mesa: 2, productos: [{ nombre: "Cerveza",     cantidad: 2, precio: 600  }], total: 1200, estado: "pendiente" },
    { id: 3, mesa: 3, productos: [{ nombre: "Empanadas",   cantidad: 3, precio: 800  }, { nombre: "Cerveza", cantidad: 2, precio: 600 }], total: 3600, estado: "pendiente" },
    { id: 4, mesa: 4, productos: [{ nombre: "Hamburguesa", cantidad: 1, precio: 1200 }], total: 1200, estado: "pendiente" },
    { id: 5, mesa: 5, productos: [{ nombre: "Pomarola",    cantidad: 1, precio: 900  }], total: 900,  estado: "pendiente" },
];

beforeEach(() => {
    jest.clearAllMocks();
});

describe("GET /pedidos", () => {
    it("devuelve la lista de pedidos con status 200", async () => {
        (PedidosService.getPedidos as jest.Mock).mockReturnValue(pedidosMock);

        const res = await request(app).get("/pedidos");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(pedidosMock);
        expect(PedidosService.getPedidos).toHaveBeenCalledTimes(1);
    });
});

describe("POST /pedidos", () => {
    it("crea un pedido y devuelve 201", async () => {
        const pedidoNuevo = { id: 6, mesa: 10, productos: [{ nombre: "Cerveza", cantidad: 1, precio: 600 }], total: 600, estado: "pendiente" };
        (PedidosService.crearPedido as jest.Mock).mockReturnValue(pedidoNuevo);

        const res = await request(app)
            .post("/pedidos")
            .send({ mesa: 10, productos: [{ nombre: "Cerveza", cantidad: 1 }] });

        expect(res.status).toBe(201);
        expect(res.body.pedido).toEqual(pedidoNuevo);
        expect(PedidosService.crearPedido).toHaveBeenCalledWith(10, [{ nombre: "Cerveza", cantidad: 1 }]);
    });

    it("devuelve 404 cuando el service lanza error de producto inexistente", async () => {
        (PedidosService.crearPedido as jest.Mock).mockImplementation(() => {
            throw new Error("El producto 'Sushi' no existe en el menú");
        });

        const res = await request(app)
            .post("/pedidos")
            .send({ mesa: 10, productos: [{ nombre: "Sushi", cantidad: 1 }] });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });

    it("devuelve 400 cuando el service lanza error de stock insuficiente", async () => {
        (PedidosService.crearPedido as jest.Mock).mockImplementation(() => {
            throw new Error("No hay suficiente stock de 'Pomarola'. Quedan: 5");
        });

        const res = await request(app)
            .post("/pedidos")
            .send({ mesa: 10, productos: [{ nombre: "Pomarola", cantidad: 999 }] });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/stock/i);
    });

    it("devuelve 400 y no llama al service si falta el campo mesa", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({ productos: [{ nombre: "Cerveza", cantidad: 1 }] });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/mesa/i);
        expect(PedidosService.crearPedido).not.toHaveBeenCalled();
    });

    it("devuelve 400 y no llama al service si productos está vacío", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({ mesa: 10, productos: [] });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/productos/i);
        expect(PedidosService.crearPedido).not.toHaveBeenCalled();
    });

    it("devuelve 400 y no llama al service si productos no es un array", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({ mesa: 10, productos: "Cerveza" });

        expect(res.status).toBe(400);
        expect(PedidosService.crearPedido).not.toHaveBeenCalled();
    });

    it("devuelve 400 y no llama al service si un producto no tiene nombre", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({ mesa: 10, productos: [{ cantidad: 1 }] });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/nombre/i);
        expect(PedidosService.crearPedido).not.toHaveBeenCalled();
    });

    it("devuelve 400 y no llama al service si cantidad es cero o negativa", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({ mesa: 10, productos: [{ nombre: "Cerveza", cantidad: 0 }] });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/cantidad/i);
        expect(PedidosService.crearPedido).not.toHaveBeenCalled();
    });
});

describe("DELETE /pedidos/:id/productos/:nombre", () => {
    it("elimina un producto del pedido y devuelve el pedido actualizado", async () => {
        const pedidoActualizado = { id: 3, mesa: 3, productos: [{ nombre: "Empanadas", cantidad: 3, precio: 800 }], total: 2400, estado: "pendiente" };
        (PedidosService.eliminarProductoDePedido as jest.Mock).mockReturnValue({
            pedido: pedidoActualizado,
            pedidoEliminado: false,
        });

        const res = await request(app).delete("/pedidos/3/productos/Cerveza");

        expect(res.status).toBe(200);
        expect(res.body.pedido).toEqual(pedidoActualizado);
        expect(PedidosService.eliminarProductoDePedido).toHaveBeenCalledWith(3, "Cerveza");
    });

    it("informa que el pedido fue eliminado si quedó sin productos", async () => {
        (PedidosService.eliminarProductoDePedido as jest.Mock).mockReturnValue({
            pedido: null,
            pedidoEliminado: true,
        });

        const res = await request(app).delete("/pedidos/1/productos/Pizza Cool");

        expect(res.status).toBe(200);
        expect(res.body.mensaje).toMatch(/eliminado/i);
    });

    it("devuelve 404 cuando el service lanza error de pedido inexistente", async () => {
        (PedidosService.eliminarProductoDePedido as jest.Mock).mockImplementation(() => {
            throw new Error("No se encontró el pedido con id 999");
        });

        const res = await request(app).delete("/pedidos/999/productos/Cerveza");

        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/pedido/i);
    });

    it("devuelve 404 cuando el service lanza error de producto no encontrado", async () => {
        (PedidosService.eliminarProductoDePedido as jest.Mock).mockImplementation(() => {
            throw new Error("El producto 'Sushi' no está en el pedido");
        });

        const res = await request(app).delete("/pedidos/4/productos/Sushi");

        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/producto/i);
    });

    it("devuelve 400 si el id no es un número válido", async () => {
        const res = await request(app).delete("/pedidos/abc/productos/Cerveza");

        expect(res.status).toBe(400);
        expect(PedidosService.eliminarProductoDePedido).not.toHaveBeenCalled();
    });
});
