import prisma from "../lib/prisma";
import { Pedido, Prisma, Mesa } from "@prisma/client";

export class PedidoService {
  // private static recalcularConsumoActual = async (mesaId: number) => {
  //   const pedidos = await prisma.pedido.findMany({
  //     where: { mesaId, estado: "Pendiente" },
  //     include: { platos: true },
  //   });
  //   const consumoActual = pedidos.reduce((sum, p) => sum + (p.precio ?? 0), 0);
  //   await prisma.mesa.update({
  //     where: { id: mesaId },
  //     data: { consumoActual },
  //   });
  // };

  static createPedido = async (data: Prisma.PedidoCreateInput) => {
    // const pedido =
    return await prisma.pedido.create({
      data,
      // include: { platos: true },
    });
    // await PedidoService.recalcularConsumoActual(pedido.mesaId);
    // return pedido;
  };

  static getPedidos = async () => {
    return await prisma.pedido.findMany({
      include: {
        mesa: true,
        plato: true,
      },
    });
  };

  static getPedidoById = async (id: Pedido["id"]) => {
    return await prisma.pedido.findUnique({
      where: { id },
      include: {
        mesa: true,
        plato: true,
      },
    });
  };

  static getPedidosByMesaId = async (mesaId: Mesa["id"]) => {
    return await prisma.pedido.findMany({
      where: {
        mesaId: mesaId,
      },
      include: {
        mesa: true,
        platos: true,
      },
    });
  };

  static updatePedido = async (
    id: Pedido["id"],
    data: Prisma.PedidoUpdateInput,
  ) => {
    return await prisma.pedido.update({
      where: { id },
      data,
      include: {
        mesa: true,
        plato: true,
      },
    });
  };

  static deletePedido = async (id: Pedido["id"]) => {
    const pedido = await prisma.pedido.findUnique({ where: { id } });
    await prisma.pedido.delete({ where: { id } });
    // if (pedido) await PedidoService.recalcularConsumoActual(pedido.mesaId);
  };
}
