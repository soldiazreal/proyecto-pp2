import { PlatoService } from "../platoServices";
import prisma from "../../lib/prisma";

jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    plato: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const mockPlato = {
  id: 1,
  codigo: 101,
  nombre: "Milanesa",
  descripcion: "Con papas fritas",
  precio: 1500,
};

describe("PlatoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPlato", () => {
    it("should create a plato", async () => {
      (prisma.plato.create as jest.Mock).mockResolvedValue(mockPlato);

      const data = { codigo: "101", nombre: "Milanesa", descripcion: "Con papas fritas", precio: 1500 };
      const result = await PlatoService.createPlato(data);

      expect(prisma.plato.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(mockPlato);
    });
  });

  describe("getPlatos", () => {
    it("should return all platos", async () => {
      (prisma.plato.findMany as jest.Mock).mockResolvedValue([mockPlato]);

      const result = await PlatoService.getPlatos();

      expect(prisma.plato.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockPlato);
    });

    it("should return empty array when no platos exist", async () => {
      (prisma.plato.findMany as jest.Mock).mockResolvedValue([]);

      const result = await PlatoService.getPlatos();

      expect(result).toEqual([]);
    });
  });

  describe("getPlatoById", () => {
    it("should return a plato by id", async () => {
      (prisma.plato.findUnique as jest.Mock).mockResolvedValue(mockPlato);

      const result = await PlatoService.getPlatoById(1);

      expect(prisma.plato.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { pedidos: true },
      });
      expect(result).toEqual(mockPlato);
    });

    it("should return null when plato does not exist", async () => {
      (prisma.plato.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await PlatoService.getPlatoById(999);

      expect(result).toBeNull();
    });
  });
});
