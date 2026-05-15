import { IMenuItem } from "../models/IMenuItem";

// ─── Estado en memoria ────────────────────────────────────────────────────────

const MENU_INICIAL: Record<string, IMenuItem> = {
    "Pizza Cool":  { stock: 10, precio: 1500 },
    "Hamburguesa": { stock: 5,  precio: 1200 },
    "Empanadas":   { stock: 20, precio: 800  },
    "Pomarola":    { stock: 5,  precio: 900  },
    "Cerveza":     { stock: 20, precio: 600  },
};

let menu: Record<string, IMenuItem> = { ...MENU_INICIAL };

export const resetState = (): void => {
    menu = Object.fromEntries(
        Object.entries(MENU_INICIAL).map(([k, v]) => [k, { ...v }])
    );
};

// ─── Consultas ────────────────────────────────────────────────────────────────

export const getMenu = (): IMenuItem[] =>
    Object.entries(menu).map(([nombre, { stock, precio }]) => ({ nombre, stock, precio }));

export const getProducto = (nombre: string): IMenuItem | undefined => menu[nombre];

export const existeProducto = (nombre: string): boolean => nombre in menu;

export const hayStock = (nombre: string, cantidad: number): boolean =>
    existeProducto(nombre) && menu[nombre].stock >= cantidad;

// ─── Mutaciones ───────────────────────────────────────────────────────────────

export const addProducto = (nombre: string, stock: number, precio: number): IMenuItem => {
    if (existeProducto(nombre)) {
        throw new Error(`El producto '${nombre}' ya existe en el menú`);
    }
    menu[nombre] = { stock, precio };
    return { nombre, stock, precio };
};

export const addStock = (nombre: string, cantidad: number): IMenuItem => {
    if (!existeProducto(nombre)) {
        throw new Error(`El producto '${nombre}' no existe en el menú`);
    }
    menu[nombre].stock += cantidad;
    return { nombre, ...menu[nombre] };
};

export const removeStock = (nombre: string, cantidad: number): void => {
    if (!existeProducto(nombre)) {
        throw new Error(`El producto '${nombre}' no existe en el menú`);
    }
    if (menu[nombre].stock < cantidad) {
        throw new Error(`No hay suficiente stock de '${nombre}'. Quedan: ${menu[nombre].stock}`);
    }
    menu[nombre].stock -= cantidad;
};

export const bajarStock = (nombre: string, cantidad: number): IMenuItem => {
    removeStock(nombre, cantidad);
    return { nombre, ...menu[nombre] };
};
