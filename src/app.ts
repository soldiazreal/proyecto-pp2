import express from "express";
import dotenv from "dotenv";
import pedidosRouter from "./controllers/PedidosController";
import menuRouter from "./controllers/MenuController";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/pedidos", pedidosRouter);
app.use("/menu", menuRouter);

app.get("/", (req, res) => {
  res.send("Servidor del grupo cool funcionando!");
});

export default app;
