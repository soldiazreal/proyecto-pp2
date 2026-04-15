const express = require("express");
const router = express.Router();


// Datos para simular la base de datos
let stock = {
    "Pizza Cool": 10,
    "Hamburguesa": 5,
    "Empanadas":20,
    "Pomarola":5,
    "Cerveza": 20
}
let pedidos = [
    {id:1, mesa:1, producto:"Pizza Cool", estado:"pendiente" },
    {id:2, mesa:2, producto:"Cerveza", estado:"pendiente" },
    {id:3, mesa:3, producto:"Empanadas", estado:"pendiente" },
    {id:4, mesa:4, producto:"Hamburguesa", estado:"pendiente" },
    {id:5, mesa:5, producto:"Pomarola", estado:"pendiente" }
];

router.get("/", (req,res) => {
    res.json(pedidos);
});

// ruta para crear un poducto nuevo
router.post("/", (req,res) => {
    const {mesa, producto, cantidad} = req.body;
    if(!stock[producto]) {
        return res.status(404).json({error: "El producto no existe en el menu"});
    }
    if(stock[producto] < cantidad) {
        return res.status(400).json({error: `No hay suficiente stock de ${producto}. Quedan: ${stock[producto]}`})
    }
    stock[producto] = stock[producto] - cantidad;
    const nuevoPedido = {id: pedidos.length + 1, mesa, producto, cantidad, estado: "Pendiente"};
    pedidos.push(nuevoPedido);
    res.status(201).json({
        mensaje:"Pedido realizado y stock actualizado",
         pedido: nuevoPedido,
         stockRestante : stock[producto]
        });

});

router.get("/stock", (req, res) => {
    const listaStock = Object.keys(stock).map(nombre => ({
        producto:nombre,
        cantidad:stock[nombre]
    }));
    res.json(listaStock);
})


module.exports = router;