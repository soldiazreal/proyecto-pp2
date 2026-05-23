const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// ROUTES
const pedidosRoutes = require('./routes/pedidos');

app.use(cors());
app.use(express.json());

// rutas
app.use('/pedidos', pedidosRoutes);

// test
app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
