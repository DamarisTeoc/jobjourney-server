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
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        connection.beginTransaction((err) => {
          if (err) {
            connection.release();
            reject(err);
            return;
          }

          // Primero, elimina las relaciones de estado de la oferta
          connection.query(
            'DELETE FROM offer_state_relations WHERE offer_id IN (SELECT offer_id FROM offers WHERE user_id = ?)',
            [user_id],
            (error, results) => {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  reject(error);
                });
              }

              // Luego, elimina las ofertas asociadas al usuario
              connection.query(
                'DELETE FROM offers WHERE user_id = ?',
                [user_id],
                (error, results) => {
                  if (error) {
                    return connection.rollback(() => {
                      connection.release();
                      reject(error);
                    });
                  }

                  // Finalmente, elimina el usuario
                  connection.query(
                    'DELETE FROM users WHERE user_id = ?',
                    [user_id],
                    (error, results) => {
                      if (error) {
                        return connection.rollback(() => {
                          connection.release();
                          reject(error);
                        });
                      }

                      connection.commit((err) => {
                        if (err) {
                          return connection.rollback(() => {
                            connection.release();
                            reject(err);
                          });
                        }
                        connection.release();
                        resolve({ message: 'User and associated offers deleted successfully', user_id });
                      });
                    }
                  );
                }
              );
            }
          );
        });
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
