const express = require ("express");
const app = express();
const PORT = 3000;
const pedidosRoutes = require("./routes/pedidos.routes");

app.use(express.json());

app.use("/pedidos", pedidosRoutes)

app.get("/", (req, res)=>{
    res.send("Servidor del grupo cool funcionando!");

});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});