import express from "express";
import dotenv from "dotenv";

import pedidosRoutes from "./routes/pedidos.routes";
import mesasRoutes from "./routes/mesas.routes";
import salonesRoutes from "./routes/salones.routes";
import usuariosRoutes from "./routes/usuarios.routes";
import platosRoutes from "./routes/platos.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

app.use(express.json());

// RUTAS
app.use("/pedidos", pedidosRoutes);
app.use("/mesas", mesasRoutes);
app.use("/salones", salonesRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/platos", platosRoutes);
app.use("/auth", authRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("Servidor del grupo cool funcionando!");
});

export default app;