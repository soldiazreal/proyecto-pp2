import app from "./app";

const port = process.env.PORT || 1500;

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
