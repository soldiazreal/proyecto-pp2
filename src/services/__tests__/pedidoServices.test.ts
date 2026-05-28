import { PedidoService } from "../pedidoServices";
import prisma from "../../lib/prisma";

jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    pedido: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("PedidoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPedido", () => {
    it("should create a pedido successfully", async () => {
      const mockPedido = {
        id: 1,
        mesaId: 1,
        productos: { plato1: 2, plato2: 1 },
        total: 45.5,
        estado: "Pendiente",
        createdAt: new Date(),
      };

      (prisma.pedido.create as jest.Mock).mockResolvedValue(mockPedido);

      const result = await PedidoService.createPedido({
        mesa: { connect: { id: 1 } },
        productos: { plato1: 2, plato2: 1 },
        total: 45.5,
      });

      expect(prisma.pedido.create).toHaveBeenCalledWith({
        data: {
          mesa: { connect: { id: 1 } },
          productos: { plato1: 2, plato2: 1 },
          total: 45.5,
        },
      });
      expect(result).toEqual(mockPedido);
    });
  });

  describe("getPedidos", () => {
    it("should get all pedidos with mesas", async () => {
      const mockPedidos = [
        {
          id: 1,
          mesaId: 1,
          productos: { plato1: 2 },
          total: 25.5,
          estado: "Pendiente",
          createdAt: new Date(),
          mesa: { id: 1, numero: 5 },
        },
        {
          id: 2,
          mesaId: 2,
          productos: { plato2: 1 },
          total: 15.0,
          estado: "Completado",
          createdAt: new Date(),
          mesa: { id: 2, numero: 10 },
        },
      ];

      (prisma.pedido.findMany as jest.Mock).mockResolvedValue(mockPedidos);

      const result = await PedidoService.getPedidos();

      expect(prisma.pedido.findMany).toHaveBeenCalledWith({
        include: { mesa: true },
      });
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockPedidos);
    });

    it("should return empty array when no pedidos exist", async () => {
      (prisma.pedido.findMany as jest.Mock).mockResolvedValue([]);

      const result = await PedidoService.getPedidos();

      expect(result).toEqual([]);
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
        mesa: { id: 1, numero: 5 },
      };

      (prisma.pedido.findUnique as jest.Mock).mockResolvedValue(mockPedido);

      const result = await PedidoService.getPedidoById(1);

      expect(prisma.pedido.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { mesa: true },
      });
      expect(result).toEqual(mockPedido);
    });

    it("should return null when pedido does not exist", async () => {
      (prisma.pedido.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await PedidoService.getPedidoById(999);

      expect(result).toBeNull();
    });
  });

  describe("getPedidosByMesaId", () => {
    it("should get pedidos by mesa id", async () => {
      const mockPedidos = [
        {
          id: 1,
          mesaId: 1,
          productos: { plato1: 2 },
          total: 25.5,
          estado: "Pendiente",
          createdAt: new Date(),
          mesa: { id: 1, numero: 5 },
        },
      ];

      (prisma.pedido.findMany as jest.Mock).mockResolvedValue(mockPedidos);

      const result = await PedidoService.getPedidosByMesaId(1);

      expect(prisma.pedido.findMany).toHaveBeenCalledWith({
        where: { mesaId: 1 },
        include: { mesa: true },
      });
      expect(result).toEqual(mockPedidos);
    });
  });

  describe("updatePedido", () => {
    it("should update pedido successfully", async () => {
      const mockUpdatedPedido = {
        id: 1,
        mesaId: 1,
        productos: { plato1: 3 },
        total: 35.5,
        estado: "Completado",
        createdAt: new Date(),
        mesa: { id: 1, numero: 5 },
      };

      (prisma.pedido.update as jest.Mock).mockResolvedValue(
        mockUpdatedPedido
      );

      const result = await PedidoService.updatePedido(1, {
        estado: "Completado",
      });

      expect(prisma.pedido.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { estado: "Completado" },
        include: { mesa: true },
      });
      expect(result).toEqual(mockUpdatedPedido);
    });
  });

  describe("deletePedido", () => {
    it("should delete pedido successfully", async () => {
      const mockDeletedPedido = {
        id: 1,
        mesaId: 1,
        productos: { plato1: 2 },
        total: 25.5,
        estado: "Pendiente",
        createdAt: new Date(),
      };

      (prisma.pedido.delete as jest.Mock).mockResolvedValue(mockDeletedPedido);

      const result = await PedidoService.deletePedido(1);

      expect(prisma.pedido.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockDeletedPedido);
    });
  });
});
