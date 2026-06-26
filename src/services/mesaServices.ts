import prisma from "../lib/prisma";
import { Mesa, Prisma } from "@prisma/client";

export class MesaService {
  static createMesa = async (data: Prisma.MesaCreateInput) => {
    return await prisma.mesa.create({ data });
  };

  static getMesas = async () => {
    return await prisma.mesa.findMany({
      include: {
        pedidos: { include: { platos: true } },
      },
    });
  };

  static getMesaById = async (id: Mesa["id"]) => {
    return await prisma.mesa.findUnique({
      where: { id },
      include: {
        pedidos: { include: { platos: true } },
      },
    });
  };

  static updateMesaState = async (
    id: Mesa["id"],
    data: Prisma.MesaUpdateInput,
  ) => {
    // if (data.estado === "Disponible") {
    //   await prisma.pedido.updateMany({
    //     where: { mesaId: id, estado: "Pendiente" },
    //     data: { estado: "Completado" },
    //   });
    // }
    return await prisma.mesa.update({ where: { id }, data });
  };

  static deleteMesa = async (id: Mesa["id"]) => {
    return await prisma.mesa.delete({ where: { id } });
  };

  static deleteMultipleMesas = async (ids: Mesa["id"][]) => {
    return await prisma.mesa.deleteMany({ where: { id: { in: ids } } });
  };
}
