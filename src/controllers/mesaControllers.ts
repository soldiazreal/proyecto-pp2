import { Request, Response } from "express";
import { MesaService } from "../services/mesaServices";

export class MesaController {
  static createMesa = async (req: Request, res: Response) => {
    try {
      const { numero, capacidad, salonId } = req.body;
      const mesa = await MesaService.createMesa({
        numero: Number(numero),
        capacidad: Number(capacidad),
        salonId: Number(salonId),
      });
      res.status(201).json(mesa);
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
      const mesa = await MesaService.getMesaById(Number(req.params.id));
      if (!mesa) return res.status(404).json({ message: "Mesa no encontrada" });
      res.json(mesa);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener mesa" });
    }
  };

  static updateMesa = async (req: Request, res: Response) => {
    try {
      const { numero, capacidad, salonId } = req.body;
      const mesa = await MesaService.updateMesa(Number(req.params.id), {
        numero: Number(numero),
        capacidad: Number(capacidad),
        salonId: Number(salonId),
      });
      res.json(mesa);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar mesa" });
    }
  };

  static deleteMesa = async (req: Request, res: Response) => {
    try {
      await MesaService.deleteMesa(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar mesa" });
    }
  };
}
