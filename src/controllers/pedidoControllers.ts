import { json, Request, Response } from "express";
import { matchedData } from "express-validator";
import { PedidoService } from "../services/pedidoServices";
import { MesaService } from "../services/mesaServices";
import { PlatoService } from "../services/platoServices";

export class PedidoController {
  static createPedido = async (req: Request, res: Response) => {
    try {
      const { mesaId, platoId, estado } = matchedData(req);

      const mesa = await MesaService.getMesaById(mesaId);
      if (!mesa) return res.status(404).json({ message: "Mesa no encontrada" });

      const plato = await PlatoService.getPlatoById(platoId);
      if (!plato)
        return res.status(404).json({ message: "Plato no encontrado" });

      await PedidoService.createPedido({
        mesa: { connect: { id: mesaId } },
        plato: { connect: { id: platoId } },
        estado: estado ?? "Pendiente",
      });
      res.status(201).json("Pedido creado correctamente");
    } catch (error) {
      console.log("El famoso", error);
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
      const { id } = matchedData(req);
      const pedido = await PedidoService.getPedidoById(id);
      if (!pedido)
        return res.status(404).json({ message: "Pedido no encontrado" });
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener pedido" });
    }
  };

  static getPedidosByMesaId = async (req: Request, res: Response) => {
    try {
      const { mesaId } = matchedData(req);
      const pedidos = await PedidoService.getPedidosByMesaId(mesaId);

      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener pedidos de la mesa" });
    }
  };

  static updatePedido = async (req: Request, res: Response) => {
    try {
      const { id, estado } = matchedData(req);
      const pedido = await PedidoService.updatePedido(id, { estado });
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar pedido" });
    }
  };

  static deletePedido = async (req: Request, res: Response) => {
    try {
      const { id } = matchedData(req);
      await PedidoService.deletePedido(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar pedido" });
    }
  };
}
