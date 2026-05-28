import prisma from "../lib/prisma";
import { Pedido, Prisma, Mesa } from "@prisma/client";

export class PedidoService {
  static createPedido = async (data: Prisma.PedidoCreateInput) => {
    return await prisma.pedido.create({ data });
  };

  static getPedidos = async () => {
    return await prisma.pedido.findMany({
      include: {
        mesa: true,
      },
    });
  };

  static getPedidoById = async (id: Pedido["id"]) => {
    return await prisma.pedido.findUnique({
      where: { id },
      include: {
        mesa: true,
      },
    });
  };

  static getPedidosByMesaId = async (mesaId: Mesa["id"]) => {
    return await prisma.pedido.findMany({
      where: { mesaId },
      include: {
        mesa: true,
      },
    });
  };

  static updatePedido = async (
    id: Pedido["id"],
    data: Prisma.PedidoUpdateInput
  ) => {
    return await prisma.pedido.update({
      where: { id },
      data,
      include: {
        mesa: true,
      },
    });
  };

  static deletePedido = async (id: Pedido["id"]) => {
    return await prisma.pedido.delete({
      where: { id },
    });
  };
}
