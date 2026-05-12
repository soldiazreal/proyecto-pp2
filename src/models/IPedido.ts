import { IProductoPedido } from "./IProductoPedido";

export interface IPedido {
    id: number;
    mesa: number;
    productos: IProductoPedido[];
    total: number;
    estado: "pendiente" | "entregado" | "cancelado";
}