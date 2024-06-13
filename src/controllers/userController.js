import UserModel from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserController = {
  registerUser: async (req, res) => {
    try {
      const newUser = await UserModel.createUser(req.body);
      res.status(201).json({ user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Error registering new user', error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      await UserModel.deleteUser(req.params.id);
      res.status(200).json({ message: 'User successfully deleted' });
    } catch (error) {
      if (error.message === 'User not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
      }
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await UserModel.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
      }
    }
  },
  updateUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await UserModel.updateUser(req.params.id, { username, email, password: hashedPassword });
      res.status(200).json({ message: 'User successfully updated', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  },


  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generar token JWT
      const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET || 'tu_clave_secreta', { expiresIn: '1h' });

      // Excluir la contraseña de la respuesta
      const { password: _, ...userWithoutPassword } = user;

      res.json({ message: 'Login successful', token, user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  },
};

export default UserController;
