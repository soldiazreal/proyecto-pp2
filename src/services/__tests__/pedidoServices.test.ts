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
    mesa: {
      update: jest.fn(),
    },
  },
}));

const mockPlato = { id: 1, codigo: 101, nombre: "Milanesa", descripcion: "Con papas", precio: 1500 };

describe("PedidoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPedido", () => {
    it("should create a pedido and recalculate consumoActual", async () => {
      const mockPedido = {
        id: 1,
        mesaId: 1,
        platoId: 1,
        estado: "Pendiente",
        createdAt: new Date(),
        plato: mockPlato,
      };

      (prisma.pedido.create as jest.Mock).mockResolvedValue(mockPedido);
      (prisma.pedido.findMany as jest.Mock).mockResolvedValue([mockPedido]);
      (prisma.mesa.update as jest.Mock).mockResolvedValue({});

      const result = await PedidoService.createPedido({
        mesa: { connect: { id: 1 } },
        plato: { connect: { id: 1 } },
      });

      expect(prisma.pedido.create).toHaveBeenCalledWith({
        data: { mesa: { connect: { id: 1 } }, plato: { connect: { id: 1 } } },
        include: { plato: true },
      });
      expect(prisma.mesa.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { consumoActual: 1500 },
      });
      expect(result).toEqual(mockPedido);
    });
  });

  describe("getPedidos", () => {
    it("should get all pedidos with mesa and plato", async () => {
      const mockPedidos = [
        { id: 1, mesaId: 1, platoId: 1, estado: "Pendiente", createdAt: new Date(), mesa: { id: 1, numero: 5 }, plato: mockPlato },
        { id: 2, mesaId: 2, platoId: 1, estado: "Completado", createdAt: new Date(), mesa: { id: 2, numero: 10 }, plato: mockPlato },
      ];

      (prisma.pedido.findMany as jest.Mock).mockResolvedValue(mockPedidos);

      const result = await PedidoService.getPedidos();

      expect(prisma.pedido.findMany).toHaveBeenCalledWith({
        include: { mesa: true, plato: true },
      });
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no pedidos exist", async () => {
      (prisma.pedido.findMany as jest.Mock).mockResolvedValue([]);
      const result = await PedidoService.getPedidos();
      expect(result).toEqual([]);
    });
  });

  describe("getPedidoById", () => {
    it("should get pedido by id with mesa and plato", async () => {
      const mockPedido = {
        id: 1,
        mesaId: 1,
        platoId: 1,
        estado: "Pendiente",
        createdAt: new Date(),
        mesa: { id: 1, numero: 5 },
        plato: mockPlato,
      };

      (prisma.pedido.findUnique as jest.Mock).mockResolvedValue(mockPedido);

      const result = await PedidoService.getPedidoById(1);

      expect(prisma.pedido.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { mesa: true, plato: true },
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
    it("should get pedidos by mesa id with plato", async () => {
      const mockPedidos = [
        { id: 1, mesaId: 1, platoId: 1, estado: "Pendiente", createdAt: new Date(), plato: mockPlato },
      ];

      (prisma.pedido.findMany as jest.Mock).mockResolvedValue(mockPedidos);

      const result = await PedidoService.getPedidosByMesaId(1);

      expect(prisma.pedido.findMany).toHaveBeenCalledWith({
        where: { mesaId: 1 },
        include: { plato: true },
      });
      expect(result).toEqual(mockPedidos);
    });
  });

  describe("updatePedido", () => {
    it("should update pedido estado", async () => {
      const mockUpdatedPedido = {
        id: 1,
        mesaId: 1,
        platoId: 1,
        estado: "Completado",
        createdAt: new Date(),
        mesa: { id: 1, numero: 5 },
        plato: mockPlato,
      };

      (prisma.pedido.update as jest.Mock).mockResolvedValue(mockUpdatedPedido);

      const result = await PedidoService.updatePedido(1, { estado: "Completado" });

      expect(prisma.pedido.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { estado: "Completado" },
        include: { mesa: true, plato: true },
      });
      expect(result).toEqual(mockUpdatedPedido);
    });
  });

  describe("deletePedido", () => {
    it("should delete pedido and recalculate consumoActual", async () => {
      const mockPedido = { id: 1, mesaId: 1, platoId: 1, estado: "Pendiente", createdAt: new Date() };

      (prisma.pedido.findUnique as jest.Mock).mockResolvedValue(mockPedido);
      (prisma.pedido.delete as jest.Mock).mockResolvedValue(mockPedido);
      (prisma.pedido.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.mesa.update as jest.Mock).mockResolvedValue({});

      await PedidoService.deletePedido(1);

      expect(prisma.pedido.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.mesa.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { consumoActual: 0 },
      });
    });
  });
});
