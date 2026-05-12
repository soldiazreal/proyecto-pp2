const express = require('express');

const app = express();
const port = 3000;

const pedidosRoutes = require('./routes/pedidos.routes');

app.use(express.json());

app.use('/pedidos', pedidosRoutes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});