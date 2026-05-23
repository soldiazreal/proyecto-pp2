import { Request, Response } from 'express';
import { crearPedido, obtenerPedidos } from '../services/pedido.service';

export const crear = async (req: Request, res: Response) => {
  const pedido = await crearPedido(req.body);
  res.json(pedido);
};

export const listar = async (req: Request, res: Response) => {
  const pedidos = await obtenerPedidos();
  res.json(pedidos);
};