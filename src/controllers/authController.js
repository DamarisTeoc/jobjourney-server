import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/User.js';

export const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.createUser({ username, email, password: hashedPassword });

    const token = jwt.sign({ user_id: newUser.user_id }, process.env.JWT_SECRET || 'tu_clave_secreta', { expiresIn: '1h' });
    console.log(token);
    res.status(201).json({ token, user: { user_id: newUser.user_id, username: newUser.username, email: newUser.email } });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Error registering new user', error: error.message });
  }
};

export const loginUser = async (req, res) => {
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

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET || 'tu_clave_secreta', { expiresIn: '1h' });
    console.log(token);

    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: 'Login successful', token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};