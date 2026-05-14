import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import router from "./routes/pedidos.routes";
import {corsConfig} from "./config/cors";


dotenv.config();
const app = express();

app.use(express.json());

app.use(cors(corsConfig))

app.use("/pedidos", router);

app.get("/", (req, res) => {
  res.send("Servidor del grupo cool funcionando!");
});

export default app;
