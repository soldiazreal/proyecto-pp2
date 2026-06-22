import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { PlatoService } from "../services/platoServices";

export class PlatoController {
  static createPlato = async (req: Request, res: Response) => {
    try {
      const data = matchedData(req);
      await PlatoService.createPlato({
        nombre: data.nombre,
        codigo: data.codigo,
        descripcion: data.descripcion,
        precio: data.precio,
      });
      res.status(201).json({ message: "Plato creado correctamente" });
    } catch (error) {
      // console.log("el body", req.body);
      // console.log("El Match", matchedData(req));
      res.status(500).json({ message: "Error al crear plato", error });
    }
  };

  static getPlatoById = async (req: Request, res: Response) => {
    try {
      const { id } = matchedData(req);
      const plato = await PlatoService.getPlatoById(id);
      if (!plato)
        return res.status(404).json({ message: "Plato no encontrado" });
      res.json(plato);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener plato" });
    }
  };

  static getPlatos = async (req: Request, res: Response) => {
    try {
      const platos = await PlatoService.getPlatos();
      res.json(platos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener platos" });
    }
  };
    static updatePlato = async (req: Request, res: Response) => {
    try {
      const { id, ...updateData } = matchedData(req);

      await PlatoService.updatePlato(id, updateData);
      res.json({ message: "El plato ha sido actualizado" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar plato" });
    }
  };

  static deletePlato = async (req: Request, res: Response) => {
    try {
      const { id } = matchedData(req);
      await PlatoService.deletePlato(id);
      res.status(204).json({ message: "El plato ha sido eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar plato" });
    }
  };

  static deleteMultiplePlatos = async (req: Request, res: Response) => {
    try {
      const { ids } = matchedData(req);
      await PlatoService.deleteMultiplePlatos(ids);

      res
        .status(200)
        .json({ message: "Se han eliminado los platos correctamente" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Ha habido un error al eliminar los platos" });
    }
  };
}
