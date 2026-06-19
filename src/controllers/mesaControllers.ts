import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { MesaService } from "../services/mesaServices";

export class MesaController {
  static createMesa = async (req: Request, res: Response) => {
    try {
      const data = matchedData(req);

      await MesaService.createMesa({
        numero: data.numero,
        capacidad: data.capacidad,
      });
      res.status(201).json({ message: "Mesa creada correctamente." });
    } catch (error) {
      res.status(500).json({ message: "Error al crear mesa" });
    }
  };

  static getMesas = async (req: Request, res: Response) => {
    try {
      const mesas = await MesaService.getMesas();
      res.json(mesas);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener mesas" });
    }
  };

  static getMesaById = async (req: Request, res: Response) => {
    try {
      const data = matchedData(req);
      const mesa = await MesaService.getMesaById(data.id);

      if (!mesa) return res.status(404).json({ message: "Mesa no encontrada" });
      res.json(mesa);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener mesa" });
    }
  };

  static updateMesa = async (req: Request, res: Response) => {
    try {
      const { id, ...updateData } = matchedData(req);

      const mesa = await MesaService.updateMesa(id, updateData);
      res.json(mesa);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar mesa" });
    }
  };

  static deleteMesa = async (req: Request, res: Response) => {
    try {
      const data = matchedData(req);
      await MesaService.deleteMesa(data.id);
      res.status(204).send({ message: "La mesa ha sido eliminada" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar mesa" });
    }
  };
}
