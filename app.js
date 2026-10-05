import express from 'express';
import cors from 'cors';
import encuestaRoutes from './src/routes/encuesta.routes.js';
import { noEncontrada, manejarErrores } from './src/middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/encuestas', encuestaRoutes);

app.use(noEncontrada);
app.use(manejarErrores);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});