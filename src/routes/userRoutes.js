import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  registerUser,
  loginUser
} from '../controllers/userController.js';
import authenticateToken from '../middlewares/authenticateToken.js';  // Asumiendo que tienes este middleware

const router = express.Router();

// Rutas para registro y login
router.post('/register', registerUser);  // Registra un nuevo usuario
router.post('/login', loginUser);  // Login de usuario

// Rutas protegidas que requieren autenticación
router.get('/', authenticateToken, getAllUsers);  // Obtener todos los usuarios, requiere autenticación
router.get('/:id', authenticateToken, getUserById);  // Obtener un usuario por ID, requiere autenticación
router.put('/:id', authenticateToken, updateUser);  // Actualizar un usuario, requiere autenticación
router.delete('/:id', authenticateToken, deleteUser);  // Eliminar un usuario, requiere autenticación

export default router;
