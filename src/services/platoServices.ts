import prisma from "../lib/prisma";
import { Plato, Prisma } from "@prisma/client";

export class PlatoService {
  static createPlato = async (data: Prisma.PlatoCreateInput) => {
    return await prisma.plato.create({ data });
  };

  static getPlatoById = async (id: Plato["id"]) => {
    return await prisma.plato.findUnique({
      where: { id },
      include: { pedidos: true },
    });
  };

  static getPlatos = async () => {
    return await prisma.plato.findMany({
      include: { pedidos: true },
    });
  };

  static updatePlato = async (id: Plato["id"], data: Prisma.PlatoUpdateInput) => {
    return await prisma.plato.update({ where: { id }, data });
  };

  static deletePlato = async (id: Plato["id"]) => {
    return await prisma.plato.delete({ where: { id } });
  };

  static deleteMultiplePlatos = async (ids: Plato["id"][]) => {
    return await prisma.plato.deleteMany({ where: { id: { in: ids } } });
  };
}