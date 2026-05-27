import  prisma  from "../lib/prisma";
import { Plato, Prisma } from "@prisma/client";

export class PlatoService{

    static createPlato = async (data : Prisma.PlatoCreateInput ) => {

        return await prisma.plato.create({data});
    }

    static getPlatoById = async (id: Plato["id"] ) => {
        return await prisma.plato.findUnique({ where: { id } });
    }

    static getPlatos = async () => {
        return await prisma.plato.findMany();
    }
    
}