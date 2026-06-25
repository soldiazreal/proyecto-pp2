import { Request, Response } from "express";
import { registrarUsuario, loginUsuario } from "../services/userServices";

export const registro = async (req: Request, res: Response) => {
  try {
    const { email, nombre, password } = req.body;

    if (!email || !nombre || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const usuario = await registrarUsuario(email, nombre, password);
    res.status(201).json({ mensaje: "Usuario registrado", usuario });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }

    const resultado = await loginUsuario(email, password);
    res.status(200).json(resultado);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
