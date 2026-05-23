import prisma from '../lib/prisma';
export const crearPedido = async (data: any) => {return await prisma.pedido.create ({data}); };

export const obtenerPedidos = async () => {return await prisma.pedido.findMany (); };