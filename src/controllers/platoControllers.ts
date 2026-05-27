import { Request,Response } from "express";
import { PlatoService } from "../services/platoServices";

export class PlatoController {

    static createPlato = async (req:Request , res : Response) => {
        const data = req.body;
        try {
            const plato = await PlatoService.createPlato(data);
            res.status(201).json(plato)
        }
        catch(error){
             res.status(500).json({message: "error al crear un plato"})
        }
    }

    static getPlatoById = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        try{
            const plato =  await PlatoService.getPlatoById(id);
            res.json(plato)
        }
        catch(error){
            res.status(500).json({message: "error en el controler al obtener un plato"})
        }
    }

    static getPlatos = async (req : Request, res: Response) => {
        try{
            const platos =  await  PlatoService.getPlatos();
            res.json(platos);
        }
        catch (error) {
            res.status(500).json({ message: "error al obtener platos" });
        }
    };

};