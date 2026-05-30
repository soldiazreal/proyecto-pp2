import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const registrarUsuario = async (email: string, nombre: string, password: string) => {
  const usuarioExistente = await prisma.user.findUnique({ where: { email } });
  if (usuarioExistente) throw new Error('El email ya está registrado');

  const passwordHasheada = await bcrypt.hash(password, 10);
  
  const usuario = await prisma.user.create({
    data: { email, nombre, password: passwordHasheada, rol: 'usuario' }
  });

  return { id: usuario.id, email: usuario.email, nombre: usuario.nombre };
};

export const loginUsuario = async (email: string, password: string) => {
  const usuario = await prisma.user.findUnique({ where: { email } });
  if (!usuario) throw new Error('Email o contraseña incorrectos');

  const passwordValida = await bcrypt.compare(password, usuario.password);
  if (!passwordValida) throw new Error('Email o contraseña incorrectos');

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '24h' });

  return { token, usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre } };
};