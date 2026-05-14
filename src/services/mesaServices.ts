import prisma from "../lib/prisma";
import { Mesa, Prisma } from "@prisma/client";

export class MesaService {
  static createMesa = async (data: Prisma.MesaCreateInput) => {
    console.log(data);
    return await prisma.mesa.create({ data });
  };

  static getMesas = async () => {
    return await prisma.mesa.findMany();
  };

  static getMesaById = async (id: Mesa["id"]) => {
    return await prisma.mesa.findUnique({ where: { id } });
  };

  static updateMesa = async (id: Mesa["id"], data: Prisma.MesaUpdateInput) => {
    return await prisma.mesa.update({ where: { id }, data });
  };

  static deleteMesa = async (id: Mesa["id"]) => {
    return await prisma.mesa.delete({ where: { id } });
  };
}
