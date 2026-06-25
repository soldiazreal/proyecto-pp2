import request from "supertest";
import express from "express";
import router from "../app.routes";
import { PedidoService } from "../../services/pedidoServices";

jest.mock("../../services/pedidoServices");
jest.mock("../../services/mesaServices");
jest.mock("../../services/platoServices");
jest.mock("../../middlewares/validators", () => ({
  validateCreateMesa: (_req: any, _res: any, next: any) => next(),
  validateMesaId: (_req: any, _res: any, next: any) => next(),
  validateUpdateMesa: (_req: any, _res: any, next: any) => next(),
  validateCreatePedido: (_req: any, _res: any, next: any) => next(),
  validateUpdatePedido: (_req: any, _res: any, next: any) => next(),
  validatePedidoId: (_req: any, _res: any, next: any) => next(),
  validateMesaIdParam: (_req: any, _res: any, next: any) => next(),
  validateCreatePlato: (_req: any, _res: any, next: any) => next(),
  validatePlatoId: (_req: any, _res: any, next: any) => next(),
  validateUpdatePlato: (_req: any, _res: any, next: any) => next(),
  validateBulkDelete: (_req: any, _res: any, next: any) => next(),
  validateBulkDeletePlatos: (_req: any, _res: any, next: any) => next(),
}));

const mockPlato = { id: 1, codigo: 101, nombre: "Milanesa", descripcion: "Con papas", precio: 1500 };
const mockPedido = { id: 1, mesaId: 1, platoId: 1, estado: "Pendiente", createdAt: new Date().toISOString(), plato: mockPlato };

const app = express();
app.use(express.json());
app.use("/api", router);

describe("Pedidos Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/pedidos", () => {
    it("should return all pedidos", async () => {
      (PedidoService.getPedidos as jest.Mock).mockResolvedValue([mockPedido]);

      const response = await request(app).get("/api/pedidos");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it("should handle errors", async () => {
      (PedidoService.getPedidos as jest.Mock).mockRejectedValue(new Error("DB error"));

      const response = await request(app).get("/api/pedidos");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/pedidos/:id", () => {
    it("should return pedido by id", async () => {
      (PedidoService.getPedidoById as jest.Mock).mockResolvedValue(mockPedido);

      const response = await request(app).get("/api/pedidos/1");

      expect(response.status).toBe(200);
    });

    it("should return 404 when pedido not found", async () => {
      (PedidoService.getPedidoById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/api/pedidos/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/mesas/:mesaId/pedidos", () => {
    it("should return pedidos for a mesa", async () => {
      (PedidoService.getPedidosByMesaId as jest.Mock).mockResolvedValue([mockPedido]);

      const response = await request(app).get("/api/mesas/1/pedidos");

      expect(response.status).toBe(200);
    });
  });

  describe("PUT /api/pedidos/:id", () => {
    it("should update pedido estado", async () => {
      (PedidoService.updatePedido as jest.Mock).mockResolvedValue({ ...mockPedido, estado: "Completado" });

      const response = await request(app)
        .put("/api/pedidos/1")
        .send({ estado: "Completado" });

      expect(response.status).toBe(200);
    });
  });

  describe("DELETE /api/pedidos/:id", () => {
    it("should delete a pedido", async () => {
      (PedidoService.deletePedido as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app).delete("/api/pedidos/1");

      expect(response.status).toBe(204);
    });
  });
});
