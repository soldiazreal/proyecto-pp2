const request = require("supertest");
const app = require("../../app");

describe("GET /pedidos", () => {
    it("devuelve la lista de pedidos", async () => {
        const res = await request(app).get("/pedidos");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it("cada pedido tiene id, mesa, productos, total y estado", async () => {
        const res = await request(app).get("/pedidos");
        for (const pedido of res.body) {
            expect(pedido).toHaveProperty("id");
            expect(pedido).toHaveProperty("mesa");
            expect(pedido).toHaveProperty("productos");
            expect(pedido).toHaveProperty("estado");
            expect(Array.isArray(pedido.productos)).toBe(true);
        }
    });

    it("cada producto del pedido tiene nombre, cantidad y precio", async () => {
        const res = await request(app).get("/pedidos");
        for (const pedido of res.body) {
            for (const producto of pedido.productos) {
                expect(producto).toHaveProperty("nombre");
                expect(producto).toHaveProperty("cantidad");
                expect(producto).toHaveProperty("precio");
                expect(typeof producto.precio).toBe("number");
            }
        }
    });
});

describe("POST /pedidos", () => {
    it("crea un pedido con un producto y guarda el precio del menú", async () => {
        const menuRes = await request(app).get("/pedidos/stock");
        const precioEnMenu = menuRes.body.find((p) => p.producto === "Cerveza").precio;

        const res = await request(app)
            .post("/pedidos")
            .send({ mesa: 10, productos: [{ nombre: "Cerveza", cantidad: 1 }] });

        expect(res.status).toBe(201);
        expect(res.body.pedido.productos[0].precio).toBe(precioEnMenu);
    });

    it("crea un pedido con múltiples productos", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({
                mesa: 11,
                productos: [
                    { nombre: "Empanadas", cantidad: 2 },
                    { nombre: "Cerveza", cantidad: 1 },
                ],
            });

        expect(res.status).toBe(201);
        expect(res.body.pedido.productos).toHaveLength(2);
    });

    it("calcula correctamente el total del pedido", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({
                mesa: 12,
                productos: [
                    { nombre: "Empanadas", cantidad: 2 },  // 800 * 2 = 1600
                    { nombre: "Cerveza",   cantidad: 3 },  // 600 * 3 = 1800
                ],
            });

        expect(res.status).toBe(201);
        expect(res.body.pedido.total).toBe(3400);
    });

    it("el precio se guarda en el pedido aunque el menú cambie", async () => {
        // Crear el pedido y verificar que el precio quedó guardado en el pedido
        const res = await request(app)
            .post("/pedidos")
            .send({ mesa: 13, productos: [{ nombre: "Pizza Cool", cantidad: 1 }] });

        expect(res.status).toBe(201);
        const precioGuardado = res.body.pedido.productos[0].precio;

        // El precio en el pedido debe ser un número fijo, no derivado del menú en el momento de consulta
        expect(typeof precioGuardado).toBe("number");
        expect(precioGuardado).toBe(1500);
    });

    it("descuenta el stock al crear el pedido", async () => {
        const stockAntes = await request(app).get("/pedidos/stock");
        const hamburguesa = stockAntes.body.find((p) => p.producto === "Hamburguesa");

        await request(app)
            .post("/pedidos")
            .send({ mesa: 14, productos: [{ nombre: "Hamburguesa", cantidad: 1 }] });

        const stockDespues = await request(app).get("/pedidos/stock");
        const hamburguesaDespues = stockDespues.body.find((p) => p.producto === "Hamburguesa");

        expect(hamburguesaDespues.stock).toBe(hamburguesa.stock - 1);
    });

    it("rechaza un producto que no existe en el menú", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({ mesa: 10, productos: [{ nombre: "Sushi", cantidad: 1 }] });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });

    it("rechaza cuando no hay stock suficiente", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({ mesa: 10, productos: [{ nombre: "Pomarola", cantidad: 999 }] });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/stock/i);
    });

    it("rechaza si falta el campo mesa", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({ productos: [{ nombre: "Cerveza", cantidad: 1 }] });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/mesa/i);
    });

    it("rechaza si productos está vacío", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({ mesa: 10, productos: [] });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/productos/i);
    });

    it("rechaza si productos no es un array", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({ mesa: 10, productos: "Cerveza" });

        expect(res.status).toBe(400);
    });

    it("no descuenta stock si un producto del pedido no existe", async () => {
        const stockAntes = await request(app).get("/pedidos/stock");
        const empanadasAntes = stockAntes.body.find((p) => p.producto === "Empanadas").stock;

        await request(app)
            .post("/pedidos")
            .send({
                mesa: 10,
                productos: [
                    { nombre: "Empanadas", cantidad: 2 },
                    { nombre: "Producto Inexistente", cantidad: 1 },
                ],
            });

        const stockDespues = await request(app).get("/pedidos/stock");
        const empanadasDespues = stockDespues.body.find((p) => p.producto === "Empanadas").stock;

        expect(empanadasDespues).toBe(empanadasAntes);
    });
});

describe("DELETE /pedidos/:id/productos/:nombre", () => {
    it("elimina un producto del pedido y devuelve el stock", async () => {
        const stockAntes = await request(app).get("/pedidos/stock");
        const pizzaAntes = stockAntes.body.find((p) => p.producto === "Pizza Cool").stock;

        const res = await request(app).delete("/pedidos/1/productos/Pizza Cool");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("mensaje");

        const stockDespues = await request(app).get("/pedidos/stock");
        const pizzaDespues = stockDespues.body.find((p) => p.producto === "Pizza Cool").stock;

        expect(pizzaDespues).toBeGreaterThan(pizzaAntes);
    });

    it("recalcula el total al eliminar un producto", async () => {
        // Crear pedido con dos productos para poder eliminar uno y verificar el total
        const crearRes = await request(app)
            .post("/pedidos")
            .send({
                mesa: 20,
                productos: [
                    { nombre: "Empanadas", cantidad: 2 },  // 800 * 2 = 1600
                    { nombre: "Cerveza",   cantidad: 1 },  // 600 * 1 = 600
                ],
            });

        const idPedido = crearRes.body.pedido.id;
        expect(crearRes.body.pedido.total).toBe(2200);

        const res = await request(app).delete(`/pedidos/${idPedido}/productos/Cerveza`);
        expect(res.status).toBe(200);
        expect(res.body.pedido.total).toBe(1600);
    });

    it("devuelve 404 si el pedido no existe", async () => {
        const res = await request(app).delete("/pedidos/999/productos/Cerveza");
        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/pedido/i);
    });

    it("devuelve 404 si el producto no está en el pedido", async () => {
        // Pedido 4 tiene solo Hamburguesa; Pizza Cool no está en él
        const res = await request(app).delete("/pedidos/4/productos/Pizza Cool");
        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/producto/i);
    });

    it("elimina el pedido si queda sin productos", async () => {
        // El pedido 2 tiene solo Cerveza
        const res = await request(app).delete("/pedidos/2/productos/Cerveza");

        expect(res.status).toBe(200);
        expect(res.body.mensaje).toMatch(/eliminado/i);

        const pedidos = await request(app).get("/pedidos");
        const pedido2 = pedidos.body.find((p) => p.id === 2);
        expect(pedido2).toBeUndefined();
    });
});

describe("GET /pedidos/stock", () => {
    it("devuelve el menú con producto, stock y precio", async () => {
        const res = await request(app).get("/pedidos/stock");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        for (const item of res.body) {
            expect(item).toHaveProperty("producto");
            expect(item).toHaveProperty("stock");
            expect(item).toHaveProperty("precio");
            expect(typeof item.precio).toBe("number");
        }
    });
});
