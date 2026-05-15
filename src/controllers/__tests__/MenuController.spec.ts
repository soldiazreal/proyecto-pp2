import request from "supertest";
import app from "../../app";
import * as MenuService from "../../services/MenuService";
jest.mock("../services/MenuService");

const menuMock = [
    { nombre: "Pizza Cool",  stock: 10, precio: 1500 },
    { nombre: "Hamburguesa", stock: 5,  precio: 1200 },
    { nombre: "Empanadas",   stock: 20, precio: 800  },
    { nombre: "Pomarola",    stock: 5,  precio: 900  },
    { nombre: "Cerveza",     stock: 20, precio: 600  },
];

beforeEach(() => {
    jest.clearAllMocks();
});

describe("GET /menu", () => {
    it("devuelve la lista del menú con status 200", async () => {
        (MenuService.getMenu as jest.Mock).mockReturnValue(menuMock);

        const res = await request(app).get("/menu");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(menuMock);
        expect(MenuService.getMenu).toHaveBeenCalledTimes(1);
    });
});

describe("POST /menu", () => {
    it("agrega un producto nuevo y devuelve 201", async () => {
        const productoNuevo = { nombre: "Milanesa", stock: 8, precio: 1100 };
        (MenuService.addProducto as jest.Mock).mockReturnValue(productoNuevo);

        const res = await request(app)
            .post("/menu")
            .send({ nombre: "Milanesa", stock: 8, precio: 1100 });

        expect(res.status).toBe(201);
        expect(res.body.producto).toEqual(productoNuevo);
        expect(MenuService.addProducto).toHaveBeenCalledWith("Milanesa", 8, 1100);
    });

    it("devuelve 409 cuando el service lanza error de producto duplicado", async () => {
        (MenuService.addProducto as jest.Mock).mockImplementation(() => {
            throw new Error("El producto 'Cerveza' ya existe en el menú");
        });

        const res = await request(app)
            .post("/menu")
            .send({ nombre: "Cerveza", stock: 10, precio: 600 });

        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty("error");
    });

    it("devuelve 400 y no llama al service si falta el nombre", async () => {
        const res = await request(app)
            .post("/menu")
            .send({ stock: 5, precio: 800 });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/nombre/i);
        expect(MenuService.addProducto).not.toHaveBeenCalled();
    });

    it("devuelve 400 y no llama al service si el stock es negativo", async () => {
        const res = await request(app)
            .post("/menu")
            .send({ nombre: "Producto Nuevo", stock: -1, precio: 500 });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/stock/i);
        expect(MenuService.addProducto).not.toHaveBeenCalled();
    });

    it("devuelve 400 y no llama al service si el precio es cero o negativo", async () => {
        const res = await request(app)
            .post("/menu")
            .send({ nombre: "Producto Nuevo", stock: 5, precio: 0 });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/precio/i);
        expect(MenuService.addProducto).not.toHaveBeenCalled();
    });

    it("devuelve 400 y no llama al service si falta el precio", async () => {
        const res = await request(app)
            .post("/menu")
            .send({ nombre: "Producto Nuevo", stock: 5 });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/precio/i);
        expect(MenuService.addProducto).not.toHaveBeenCalled();
    });
});

describe("PATCH /menu/:nombre/stock/add", () => {
    it("suma stock y devuelve el producto actualizado", async () => {
        const productoActualizado = { nombre: "Empanadas", stock: 25, precio: 800 };
        (MenuService.addStock as jest.Mock).mockReturnValue(productoActualizado);

        const res = await request(app)
            .patch("/menu/Empanadas/stock/add")
            .send({ cantidad: 5 });

        expect(res.status).toBe(200);
        expect(res.body.producto).toEqual(productoActualizado);
        expect(MenuService.addStock).toHaveBeenCalledWith("Empanadas", 5);
    });

    it("devuelve 404 cuando el service lanza error de producto inexistente", async () => {
        (MenuService.addStock as jest.Mock).mockImplementation(() => {
            throw new Error("El producto 'Inexistente' no existe en el menú");
        });

        const res = await request(app)
            .patch("/menu/Inexistente/stock/add")
            .send({ cantidad: 5 });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });

    it("devuelve 400 y no llama al service si cantidad es cero", async () => {
        const res = await request(app)
            .patch("/menu/Cerveza/stock/add")
            .send({ cantidad: 0 });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/cantidad/i);
        expect(MenuService.addStock).not.toHaveBeenCalled();
    });

    it("devuelve 400 y no llama al service si falta cantidad", async () => {
        const res = await request(app)
            .patch("/menu/Cerveza/stock/add")
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/cantidad/i);
        expect(MenuService.addStock).not.toHaveBeenCalled();
    });
});

describe("PATCH /menu/:nombre/stock/remove", () => {
    it("resta stock y devuelve el producto actualizado", async () => {
        const productoActualizado = { nombre: "Cerveza", stock: 18, precio: 600 };
        (MenuService.bajarStock as jest.Mock).mockReturnValue(productoActualizado);

        const res = await request(app)
            .patch("/menu/Cerveza/stock/remove")
            .send({ cantidad: 2 });

        expect(res.status).toBe(200);
        expect(res.body.producto).toEqual(productoActualizado);
        expect(MenuService.bajarStock).toHaveBeenCalledWith("Cerveza", 2);
    });

    it("devuelve 400 cuando el service lanza error de stock insuficiente", async () => {
        (MenuService.bajarStock as jest.Mock).mockImplementation(() => {
            throw new Error("No hay suficiente stock de 'Pomarola'. Quedan: 5");
        });

        const res = await request(app)
            .patch("/menu/Pomarola/stock/remove")
            .send({ cantidad: 999 });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/stock/i);
    });

    it("devuelve 404 cuando el service lanza error de producto inexistente", async () => {
        (MenuService.bajarStock as jest.Mock).mockImplementation(() => {
            throw new Error("El producto 'Inexistente' no existe en el menú");
        });

        const res = await request(app)
            .patch("/menu/Inexistente/stock/remove")
            .send({ cantidad: 1 });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });

    it("devuelve 400 y no llama al service si cantidad es negativa", async () => {
        const res = await request(app)
            .patch("/menu/Cerveza/stock/remove")
            .send({ cantidad: -3 });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/cantidad/i);
        expect(MenuService.bajarStock).not.toHaveBeenCalled();
    });
});
