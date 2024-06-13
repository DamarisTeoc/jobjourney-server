import pool from './database.js';
import bcrypt from 'bcryptjs';

const UserModel = {
  createUser: ({ username, email, password }) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password],
        (error, results) => {
          if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
              reject(new Error('Username or email already exists'));
            } else {
              reject(new Error('Error creating user'));
            }
          } else {
            resolve({ user_id: results.insertId, username, email });
          }
        }
      );
    });
  },

  findUserByUsername: (username) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (error, results) => {
          if (error) {
            reject(new Error('Error finding user by username'));
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  },


  deleteUser: (user_id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM users WHERE user_id = ?';
      pool.query(sql, [user_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.affectedRows === 0) {
            // No se encontró el usuario para eliminar
            reject(new Error('User not found'));
          } else {
            // Usuario eliminado con éxito
            resolve({ message: 'User deleted successfully', user_id });
          }
        }
      });
    });
  },

  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT user_id, username, email FROM users'; // No incluir la contraseña por seguridad
      pool.query(sql, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },

  getUserById: (user_id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT user_id, username, email FROM users WHERE id = ?'; // No incluir la contraseña por seguridad
      pool.query(sql, [user_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
            resolve(results[0]);
          } else {
            reject(new Error('User not found'));
          }
        }
      });
    });
  },

};

export default UserModel;
