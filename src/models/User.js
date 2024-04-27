import pool from './database.js';  
import bcrypt from 'bcryptjs';


export const createUser = (user) => {
  const { username, email, password } = user;

  return new Promise((resolve, reject) => {
    // Validar que el email y username no estén vacíos, etc. (implementación depende de ti)
    if (password.length < 8) {
      reject(new Error('Password must be at least 8 characters long'));
      return;
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        reject(err);
        return;
      }

      const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      pool.query(sql, [username, email, hashedPassword], (error, results) => {
        if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            // Manejar duplicados, por ejemplo, username o email ya registrados
            reject(new Error('Username or email already exists'));
          } else {
            reject(error);
          }
        } else {
          resolve({ id: results.insertId, username, email });
        }
      });
    });
  });
};


export const findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    pool.query(sql, [username], (error, results) => {
      if (error) reject(error);
      else resolve(results.length > 0 ? results[0] : null);
    });
  });
};


export const findAllUsers = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users', (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

export const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
      if (error) reject(error);
      else resolve(results[0]);  // Supone que solo se devuelve un registro
    });
  });
};


export const updateUser = (id, user) => {
  const { username, email, password } = user;
  return new Promise(async (resolve, reject) => {
    let sql;
    const params = [username, email, id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
      params.splice(2, 0, hashedPassword); // Inserta la contraseña hasheada antes del id
    } else {
      sql = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
    }

    pool.query(sql, params, (error) => {
      if (error) reject(error);
      else resolve({ id, username, email }); // No devolver la contraseña
    });
  });
};


export const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};
