import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import router from "./routes/pedidos.routes";
import mesaRoutes from "./routes/mesas.routes";
import platoRoutes from "./routes/plato.routes"
import usuariosRoutes from "./routes/usuarios.routes";
import cors from "cors";
import { corsConfig } from "./config/cors";

dotenv.config();
const app = express();

app.use(cors(corsConfig));
app.use(express.json());
app.use(morgan("dev"));

app.use("/app", router);
app.use("/api", mesaRoutes);
app.use("/api", platoRoutes)
app.use("/api/usuarios", usuariosRoutes);

app.get("/", (req, res) => {
  res.send("Servidor del grupo cool funcionando!");
});

export default app;
