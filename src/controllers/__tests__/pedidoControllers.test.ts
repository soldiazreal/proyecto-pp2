import { Request, Response } from "express";
import { PedidoController } from "../pedidoControllers";
import { PedidoService } from "../../services/pedidoServices";

jest.mock("../../services/pedidoServices");

describe("PedidoController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnValue({});
    responseStatus = jest.fn().mockReturnValue({ json: responseJson, send: jest.fn() });
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      json: responseJson,
      status: responseStatus,
    };
    jest.clearAllMocks();
  });

  describe("createPedido", () => {
    it("should create a pedido and return 201", async () => {
      const mockPedido = {
        id: 1,
        mesaId: 1,
        productos: { plato1: 2 },
        total: 25.5,
        estado: "Pendiente",
        createdAt: new Date(),
      };

      mockRequest.body = {
        mesaId: 1,
        productos: { plato1: 2 },
        total: 25.5,
      };

      (PedidoService.createPedido as jest.Mock).mockResolvedValue(mockPedido);

      await PedidoController.createPedido(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(mockPedido);
    });

    it("should return 500 on error", async () => {
      mockRequest.body = {
        mesaId: 1,
        productos: { plato1: 2 },
        total: 25.5,
      };

      (PedidoService.createPedido as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await PedidoController.createPedido(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        message: "Error al crear pedido",
      });
    });
  });

  describe("getPedidos", () => {
    it("should get all pedidos", async () => {
      const mockPedidos = [
        {
          id: 1,
          mesaId: 1,
          productos: { plato1: 2 },
          total: 25.5,
          estado: "Pendiente",
          createdAt: new Date(),
        },
      ];

      (PedidoService.getPedidos as jest.Mock).mockResolvedValue(mockPedidos);

      await PedidoController.getPedidos(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseJson).toHaveBeenCalledWith(mockPedidos);
    });

    it("should return 500 on error", async () => {
      (PedidoService.getPedidos as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await PedidoController.getPedidos(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        message: "Error al obtener pedidos",
      });
    });
  });

  describe("getPedidoById", () => {
    it("should get pedido by id", async () => {
      const mockPedido = {
        id: 1,
        mesaId: 1,
        productos: { plato1: 2 },
        total: 25.5,
        estado: "Pendiente",
        createdAt: new Date(),
      };

      mockRequest.params = { id: "1" };

      (PedidoService.getPedidoById as jest.Mock).mockResolvedValue(mockPedido);

      await PedidoController.getPedidoById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(PedidoService.getPedidoById).toHaveBeenCalledWith(1);
      expect(responseJson).toHaveBeenCalledWith(mockPedido);
    });

    it("should return 404 when pedido not found", async () => {
      mockRequest.params = { id: "999" };

      (PedidoService.getPedidoById as jest.Mock).mockResolvedValue(null);

      await PedidoController.getPedidoById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        message: "Pedido no encontrado",
      });
    });

    it("should return 500 on error", async () => {
      mockRequest.params = { id: "1" };

      (PedidoService.getPedidoById as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await PedidoController.getPedidoById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        message: "Error al obtener pedido",
      });
    });
  });

  describe("updatePedido", () => {
    it("should update pedido successfully", async () => {
      const mockUpdatedPedido = {
        id: 1,
        mesaId: 1,
        productos: { plato1: 2 },
        total: 25.5,
        estado: "Completado",
        createdAt: new Date(),
      };

      mockRequest.params = { id: "1" };
      mockRequest.body = { estado: "Completado" };

      (PedidoService.updatePedido as jest.Mock).mockResolvedValue(
        mockUpdatedPedido
      );

      await PedidoController.updatePedido(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseJson).toHaveBeenCalledWith(mockUpdatedPedido);
    });

    it("should return 500 on error", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { estado: "Completado" };

      (PedidoService.updatePedido as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await PedidoController.updatePedido(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        message: "Error al actualizar pedido",
      });
    });
  });

  describe("deletePedido", () => {
    it("should delete pedido successfully", async () => {
      mockRequest.params = { id: "1" };

      (PedidoService.deletePedido as jest.Mock).mockResolvedValue({});

      await PedidoController.deletePedido(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(204);
    });

    it("should return 500 on error", async () => {
      mockRequest.params = { id: "1" };

      (PedidoService.deletePedido as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await PedidoController.deletePedido(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        message: "Error al eliminar pedido",
      });
    });
  });
});
