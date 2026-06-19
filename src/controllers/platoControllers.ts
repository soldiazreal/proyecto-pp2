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
}
