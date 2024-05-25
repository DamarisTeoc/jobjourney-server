import express from 'express';
import UserController from '../controllers/userController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', UserController.registerUser);

// Ruta para obtener todos los usuarios (protegida)
router.get('/', authenticateToken, UserController.getAllUsers);

// Ruta para obtener un usuario por su ID (protegida)
router.get('/:id', authenticateToken, UserController.getUserById);

// Ruta para eliminar un usuario por su ID (protegida)
router.delete('/:id', authenticateToken, UserController.deleteUser);

// Ruta para actualizar un usuario por su ID (protegida)
router.put('/:id', authenticateToken, UserController.updateUser);

export default router;
