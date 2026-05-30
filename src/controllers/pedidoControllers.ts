import { Request, Response } from "express";
import { PedidoService } from "../services/pedidoServices";

export class PedidoController {
  static createPedido = async (req: Request, res: Response) => {
    try {
      const { mesaId, platoId, estado } = req.body;
      const pedido = await PedidoService.createPedido({
        mesa: { connect: { id: Number(mesaId) } },
        plato: { connect: { id: Number(platoId) } },
        estado: estado || "Pendiente",
      });
      res.status(201).json(pedido);
    } catch (error) {
      res.status(500).json({ message: "Error al crear pedido" });
    }
  };

  static getPedidos = async (req: Request, res: Response) => {
    try {
      const pedidos = await PedidoService.getPedidos();
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener pedidos" });
    }
  };

  static getPedidoById = async (req: Request, res: Response) => {
    try {
      const pedido = await PedidoService.getPedidoById(Number(req.params.id));
      if (!pedido)
        return res.status(404).json({ message: "Pedido no encontrado" });
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener pedido" });
    }
  };

  static getPedidosByMesaId = async (req: Request, res: Response) => {
    try {
      const pedidos = await PedidoService.getPedidosByMesaId(
        Number(req.params.mesaId)
      );
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener pedidos de la mesa" });
    }
  };

  static updatePedido = async (req: Request, res: Response) => {
    try {
      const { estado } = req.body;
      const pedido = await PedidoService.updatePedido(Number(req.params.id), {
        estado,
      });
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar pedido" });
    }
  };

  static deletePedido = async (req: Request, res: Response) => {
    try {
      await PedidoService.deletePedido(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar pedido" });
    }
  };
}
