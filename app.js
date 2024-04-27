// Importación de módulos usando ES Modules
import 'dotenv/config';
import express from 'express';
import userRoutes from './src/routes/userRoutes.js';
import offerRoutes from './src/routes/offerRoutes.js';
import offerStateRelationRoutes from './src/routes/offerStateRelationRoutes.js'; 
import pool from './src/models/database.js';
import authenticateToken from './src/middlewares/authenticateToken.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

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

// Rutas para usuarios
app.use('/api/users', userRoutes);
app.get('/api/protected', authenticateToken, (req, res) => {
  res.send('Protected data');
});
//rutas para ofertas
app.use('/api/offers', offerRoutes);
app.use('/api/offers/states', offerStateRelationRoutes);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


