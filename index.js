const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const encuestaRoutes = require('./src/routes/encuesta.routes');

// Middleware para entender JSON
app.use(express.json());

// Montar las rutas en la API
app.use('/api/encuestas', encuestaRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Encuestas (Estructura MVC)' });
});

app.listen(PORT, () => {
  console.log(`Servidor MVC ejecutándose en http://localhost:${PORT}`);
});
