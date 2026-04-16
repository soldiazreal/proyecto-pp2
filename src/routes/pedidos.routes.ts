import { Router, Request, Response } from "express";
const router = Router();

// Datos para simular la base de datos

type stockType = {
  PizzaCool: number;
  Hamburguesa: number;
  Empanadas: number;
  Pomarola: number;
  Cerveza: number;
};

let stock: stockType = {
  PizzaCool: 10,
  Hamburguesa: 5,
  Empanadas: 20,
  Pomarola: 5,
  Cerveza: 20,
};

let pedidos = [
  { id: 1, mesa: 1, producto: "Pizza Cool", estado: "pendiente" },
  { id: 2, mesa: 2, producto: "Cerveza", estado: "pendiente" },
  { id: 3, mesa: 3, producto: "Empanadas", estado: "pendiente" },
  { id: 4, mesa: 4, producto: "Hamburguesa", estado: "pendiente" },
  { id: 5, mesa: 5, producto: "Pomarola", estado: "pendiente" },
];

router.get("/", (req: Request, res: Response) => {
  res.json(pedidos);
});

// ruta para crear un poducto nuevo
router.post("/", (req: Request, res: Response) => {
  const { mesa, producto, cantidad } = req.body;
  const productoKey = producto as keyof stockType;
  if (!stock[productoKey]) {
    return res.status(404).json({ error: "El producto no existe en el menu" });
  }
  if (stock[productoKey] < cantidad) {
    return res.status(400).json({
      error: `No hay suficiente stock de ${producto}. Quedan: ${stock[productoKey]}`,
    });
  }
  stock[productoKey] = stock[productoKey] - cantidad;
  const nuevoPedido = {
    id: pedidos.length + 1,
    mesa,
    producto,
    cantidad,
    estado: "Pendiente",
  };
  pedidos.push(nuevoPedido);
  res.status(201).json({
    mensaje: "Pedido realizado y stock actualizado",
    pedido: nuevoPedido,
    stockRestante: stock[productoKey],
  });
});

router.get("/stock", (req: Request, res: Response) => {
  const listaStock = Object.keys(stock).map((nombre) => ({
    producto: nombre,
    cantidad: stock[nombre as keyof stockType],
  }));
  res.json(listaStock);
});

export default router;
