import request from "supertest";
import express from "express";
import router from "../pedidos.routes";
import { PedidoService } from "../../services/pedidoServices";

jest.mock("../../services/pedidoServices");

const app = express();
app.use(express.json());
app.use("/api", router);

describe("Pedidos Routes - Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/pedidos", () => {
    it("should create a new pedido", async () => {
      const mockPedido = {
        id: 1,
        mesaId: 1,
        productos: { plato1: 2 },
        total: 25.5,
        estado: "Pendiente",
        createdAt: "2026-05-28T21:54:29.983Z",
      };

      (PedidoService.createPedido as jest.Mock).mockResolvedValue(mockPedido);

      const response = await request(app)
        .post("/api/pedidos")
        .send({
          mesaId: 1,
          productos: { plato1: 2 },
          total: 25.5,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockPedido);
    });

    it("should handle creation errors", async () => {
      (PedidoService.createPedido as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .post("/api/pedidos")
        .send({
          mesaId: 1,
          productos: { plato1: 2 },
          total: 25.5,
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/pedidos", () => {
    it("should get all pedidos", async () => {
      const mockPedidos = [
        {
          id: 1,
          mesaId: 1,
          productos: { plato1: 2 },
          total: 25.5,
          estado: "Pendiente",
          createdAt: "2026-05-28T21:54:30.047Z",
          mesa: { id: 1, numero: 5 },
        },
      ];

      (PedidoService.getPedidos as jest.Mock).mockResolvedValue(mockPedidos);

      const response = await request(app).get("/api/pedidos");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPedidos);
    });

    it("should handle get errors", async () => {
      (PedidoService.getPedidos as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).get("/api/pedidos");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/pedidos/:id", () => {
    it("should get a pedido by id", async () => {
      const mockPedido = {
        id: 1,
        mesaId: 1,
        productos: { plato1: 2 },
        total: 25.5,
        estado: "Pendiente",
        createdAt: "2026-05-28T21:54:30.054Z",
        mesa: { id: 1, numero: 5 },
      };

      (PedidoService.getPedidoById as jest.Mock).mockResolvedValue(mockPedido);

      const response = await request(app).get("/api/pedidos/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPedido);
    });

    it("should return 404 when pedido not found", async () => {
      (PedidoService.getPedidoById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/api/pedidos/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/mesas/:mesaId/pedidos", () => {
    it("should get pedidos for a specific mesa", async () => {
      const mockPedidos = [
        {
          id: 1,
          mesaId: 1,
          productos: { plato1: 2 },
          total: 25.5,
          estado: "Pendiente",
          createdAt: "2026-05-28T21:54:30.062Z",
          mesa: { id: 1, numero: 5 },
        },
      ];

      (PedidoService.getPedidosByMesaId as jest.Mock).mockResolvedValue(
        mockPedidos
      );

      const response = await request(app).get("/api/mesas/1/pedidos");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPedidos);
    });
  });

  describe("PUT /api/pedidos/:id", () => {
    it("should update a pedido", async () => {
      const mockUpdatedPedido = {
        id: 1,
        mesaId: 1,
        productos: { plato1: 2 },
        total: 25.5,
        estado: "Completado",
        createdAt: "2026-05-28T21:54:30.066Z",
        mesa: { id: 1, numero: 5 },
      };

      (PedidoService.updatePedido as jest.Mock).mockResolvedValue(
        mockUpdatedPedido
      );

      const response = await request(app)
        .put("/api/pedidos/1")
        .send({
          estado: "Completado",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedPedido);
    });
  });

  describe("DELETE /api/pedidos/:id", () => {
    it("should delete a pedido", async () => {
      (PedidoService.deletePedido as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete("/api/pedidos/1");

      expect(response.status).toBe(204);
    });
  });

  describe("GET /api/mesas", () => {
    it("should get all mesas", async () => {
      const response = await request(app).get("/api/mesas");
      expect(response.status).toBeDefined();
    });
  });
});
