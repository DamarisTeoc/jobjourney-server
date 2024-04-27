import { createPool } from 'mysql2';

// Configuración de la conexión a la base de datos
const pool = createPool({
  connectionLimit : 10, // número máximo de conexiones
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME
});

export default pool;