import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import offerRoutes from './src/routes/offerRoutes.js';
import offerStateRelationRoutes from './src/routes/offerStateRelationRoutes.js'; 
import pool from './src/models/database.js';
import authenticateToken from './src/middlewares/authenticateToken.js';
import authRoutes from './src/routes/authRoutes.js';

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', 
}));

// Prueba de conexión a la base de datos
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error al conectarse a la base de datos:", err);
    return;
  }
  console.log('Conectado a la base de datos con éxito');
  connection.release();
});

const PORT = process.env.PORT || 3000;

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Bienvenido al servidor de JobJourney!');
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/offers/states', authenticateToken, offerStateRelationRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


