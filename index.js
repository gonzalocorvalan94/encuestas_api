import express from 'express';
import encuestaRoutes from './src/routes/encuesta.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/encuestas', encuestaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor MVC ejecutándose en http://localhost:${PORT}`);
});
