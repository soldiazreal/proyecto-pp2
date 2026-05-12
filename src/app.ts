import express from "express";
import dotenv from "dotenv";
import router from "./controller/PedidosController";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/pedidos", router);

app.get("/", (req, res) => {
  res.send("Servidor del grupo cool funcionando!");
});

export default app;
