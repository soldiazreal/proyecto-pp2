import { Request, Response } from "express";
import { PedidoController } from "../pedidoControllers";
import { PedidoService } from "../../services/pedidoServices";
import { MesaService } from "../../services/mesaServices";
import { PlatoService } from "../../services/platoServices";

jest.mock("../../services/pedidoServices");
jest.mock("../../services/mesaServices");
jest.mock("../../services/platoServices");
jest.mock("express-validator", () => ({
  matchedData: (req: Request) => ({ ...req.body, ...req.params }),
}));

const mockPlato = { id: 1, codigo: 101, nombre: "Milanesa", descripcion: "Con papas", precio: 1500 };
const mockMesa = { id: 1, numero: 5, capacidad: 4, estado: "Ocupada", clientesActuales: 2, consumoActual: 0 };
const mockPedido = { id: 1, mesaId: 1, platoId: 1, estado: "Pendiente", createdAt: new Date(), plato: mockPlato };

describe("PedidoController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnValue({});
    responseStatus = jest.fn().mockReturnValue({ json: responseJson, send: jest.fn() });
    mockRequest = { body: {}, params: {} };
    mockResponse = { json: responseJson, status: responseStatus };
    jest.clearAllMocks();
  });

  describe("createPedido", () => {
    it("should create a pedido and return 201", async () => {
      mockRequest.body = { mesaId: 1, platoId: 1 };

      (MesaService.getMesaById as jest.Mock).mockResolvedValue(mockMesa);
      (PlatoService.getPlatoById as jest.Mock).mockResolvedValue(mockPlato);
      (PedidoService.createPedido as jest.Mock).mockResolvedValue(mockPedido);

      await PedidoController.createPedido(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(201);
    });

    it("should return 404 when mesa not found", async () => {
      mockRequest.body = { mesaId: 999, platoId: 1 };

      (MesaService.getMesaById as jest.Mock).mockResolvedValue(null);

      await PedidoController.createPedido(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: "Mesa no encontrada" });
    });

    it("should return 404 when plato not found", async () => {
      mockRequest.body = { mesaId: 1, platoId: 999 };

      (MesaService.getMesaById as jest.Mock).mockResolvedValue(mockMesa);
      (PlatoService.getPlatoById as jest.Mock).mockResolvedValue(null);

      await PedidoController.createPedido(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: "Plato no encontrado" });
    });

    it("should return 500 on error", async () => {
      mockRequest.body = { mesaId: 1, platoId: 1 };

      (MesaService.getMesaById as jest.Mock).mockRejectedValue(new Error("DB error"));

      await PedidoController.createPedido(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: "Error al crear pedido" });
    });
  });

  describe("getPedidos", () => {
    it("should get all pedidos", async () => {
      (PedidoService.getPedidos as jest.Mock).mockResolvedValue([mockPedido]);

      await PedidoController.getPedidos(mockRequest as Request, mockResponse as Response);

      expect(responseJson).toHaveBeenCalledWith([mockPedido]);
    });

    it("should return 500 on error", async () => {
      (PedidoService.getPedidos as jest.Mock).mockRejectedValue(new Error("DB error"));

      await PedidoController.getPedidos(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: "Error al obtener pedidos" });
    });
  });

  describe("getPedidoById", () => {
    it("should get pedido by id", async () => {
      mockRequest.params = { id: "1" };

      (PedidoService.getPedidoById as jest.Mock).mockResolvedValue(mockPedido);

      await PedidoController.getPedidoById(mockRequest as Request, mockResponse as Response);

      expect(responseJson).toHaveBeenCalledWith(mockPedido);
    });

    it("should return 404 when pedido not found", async () => {
      mockRequest.params = { id: "999" };

      (PedidoService.getPedidoById as jest.Mock).mockResolvedValue(null);

      await PedidoController.getPedidoById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ message: "Pedido no encontrado" });
    });

    it("should return 500 on error", async () => {
      mockRequest.params = { id: "1" };

      (PedidoService.getPedidoById as jest.Mock).mockRejectedValue(new Error("DB error"));

      await PedidoController.getPedidoById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: "Error al obtener pedido" });
    });
  });

  describe("updatePedido", () => {
    it("should update pedido successfully", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { estado: "Completado" };

      (PedidoService.updatePedido as jest.Mock).mockResolvedValue({ ...mockPedido, estado: "Completado" });

      await PedidoController.updatePedido(mockRequest as Request, mockResponse as Response);

      expect(responseJson).toHaveBeenCalledWith({ ...mockPedido, estado: "Completado" });
    });

    it("should return 500 on error", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { estado: "Completado" };

      (PedidoService.updatePedido as jest.Mock).mockRejectedValue(new Error("DB error"));

      await PedidoController.updatePedido(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: "Error al actualizar pedido" });
    });
  });

  describe("deletePedido", () => {
    it("should delete pedido successfully", async () => {
      mockRequest.params = { id: "1" };

      (PedidoService.deletePedido as jest.Mock).mockResolvedValue(undefined);

      await PedidoController.deletePedido(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(204);
    });

    it("should return 500 on error", async () => {
      mockRequest.params = { id: "1" };

      (PedidoService.deletePedido as jest.Mock).mockRejectedValue(new Error("DB error"));

      await PedidoController.deletePedido(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: "Error al eliminar pedido" });
    });
  });
});
