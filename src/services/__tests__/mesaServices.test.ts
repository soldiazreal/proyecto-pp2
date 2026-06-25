import { MesaService } from "../mesaServices";
import prisma from "../../lib/prisma";

jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    mesa: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockMesa = {
  id: 1,
  numero: 5,
  capacidad: 4,
  estado: "Disponible",
  clientesActuales: 0,
  meseroAsignado: null,
  horaOcupacion: null,
  duracionEstimada: null,
  consumoActual: 0,
  fechaCreacion: new Date(),
  fechaModificacion: new Date(),
};

describe("MesaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createMesa", () => {
    it("should create a mesa", async () => {
      (prisma.mesa.create as jest.Mock).mockResolvedValue(mockMesa);

      const result = await MesaService.createMesa({ numero: 5, capacidad: 4 });

      expect(prisma.mesa.create).toHaveBeenCalledWith({ data: { numero: 5, capacidad: 4 } });
      expect(result).toEqual(mockMesa);
    });
  });

  describe("getMesas", () => {
    it("should return all mesas", async () => {
      (prisma.mesa.findMany as jest.Mock).mockResolvedValue([mockMesa]);

      const result = await MesaService.getMesas();

      expect(prisma.mesa.findMany).toHaveBeenCalledWith({
        include: { pedidos: { include: { plato: true } } },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockMesa);
    });

    it("should return empty array when no mesas exist", async () => {
      (prisma.mesa.findMany as jest.Mock).mockResolvedValue([]);

      const result = await MesaService.getMesas();

      expect(result).toEqual([]);
    });
  });

  describe("getMesaById", () => {
    it("should return a mesa by id", async () => {
      (prisma.mesa.findUnique as jest.Mock).mockResolvedValue(mockMesa);

      const result = await MesaService.getMesaById(1);

      expect(prisma.mesa.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { pedidos: { include: { plato: true } } },
      });
      expect(result).toEqual(mockMesa);
    });

    it("should return null when mesa does not exist", async () => {
      (prisma.mesa.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await MesaService.getMesaById(999);

      expect(result).toBeNull();
    });
  });

  describe("updateMesa", () => {
    it("should update a mesa", async () => {
      const updated = { ...mockMesa, estado: "Ocupada", clientesActuales: 3 };
      (prisma.mesa.update as jest.Mock).mockResolvedValue(updated);

      const result = await MesaService.updateMesa(1, { estado: "Ocupada", clientesActuales: 3 });

      expect(prisma.mesa.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { estado: "Ocupada", clientesActuales: 3 },
      });
      expect(result.estado).toBe("Ocupada");
      expect(result.clientesActuales).toBe(3);
    });
  });

  describe("deleteMesa", () => {
    it("should delete a mesa", async () => {
      (prisma.mesa.delete as jest.Mock).mockResolvedValue(mockMesa);

      await MesaService.deleteMesa(1);

      expect(prisma.mesa.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
