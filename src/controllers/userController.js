import * as UserModel from '../models/User.js';
import { generateToken } from '../utils/auth.js'

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error getting users', error });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findUserById(req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error getting user', error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await UserModel.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await UserModel.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

export const registerUser = async (req, res) => {
  try {
    const newUser = await UserModel.createUser(req.body);
    const token = generateToken({ id: newUser.id, username: newUser.username });
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering new user', error });
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
    const token = generateToken({ id: user.id, username: user.username });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
