import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { MesaService } from "../services/mesaServices";

export class MesaController {
  static createMesa = async (req: Request, res: Response) => {
    try {
      const data = matchedData(req);

      const nuevaMesa = await MesaService.createMesa({
        numero: data.numero,
        capacidad: data.capacidad,
      });
      res.status(201).json(nuevaMesa);
    } catch (error) {
      res.status(500).json({ message: "Error al crear mesa" });
    }
  };

  static getMesas = async (req: Request, res: Response) => {
    try {
      const mesas = await MesaService.getMesas();
      if (!mesas)
        return res.status(400).json({ message: "No se han encontrado mesas" });

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

      MesaService.updateMesa(id, updateData);
      res.json({ message: "La mesa ha sido actualizada" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar mesa" });
    }
  };

  static deleteMesa = async (req: Request, res: Response) => {
    try {
      const data = matchedData(req);
      await MesaService.deleteMesa(data.id);
      res.status(204).json({ message: "La mesa ha sido eliminada" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar mesa" });
    }
  };

  static deleteMultipleMesas = async (req: Request, res: Response) => {
    try {
      const { ids } = matchedData(req);
      await MesaService.deleteMultipleMesas(ids);

      res
        .status(200)
        .json({ message: "Se han eliminado las mesas correctamente" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Ha habido un error al eliminar las mesas" });
    }
  };
}
