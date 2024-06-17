import pool from './database.js';


export const getCurrentStateByOfferId = (offerId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT osr.*, os.name
      FROM offer_state_relations osr
      JOIN offer_states os ON osr.state_id = os.state_id
      WHERE osr.offer_id = ? 
      ORDER BY osr.moved_at DESC
      LIMIT 1;
    `;
    pool.query(sql, [offerId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);  // Retorna el estado más reciente
      }
    });
  });
};


export const getStateHistoryByOfferId = (offerId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT osr.*, os.name
      FROM offer_state_relations osr
      JOIN offer_states os ON osr.state_id = os.state_id
      WHERE osr.offer_id = ? 
      ORDER BY osr.moved_at;
    `;
    pool.query(sql, [offerId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);  // Retorna todos los movimientos de estados para la oferta
      }
    });
  });
};

export const updateOfferState = (offerId, newStateId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO offer_state_relations (offer_id, state_id, moved_at)
      VALUES (?, ?, NOW());
    `;
    pool.query(sql, [offerId, newStateId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.insertId);  // Retorna el ID del nuevo registro
      }
    });
  });
};

export const getAllStates = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM offer_states';
    pool.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

export const getStateByName = (stateName) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM offer_states WHERE name = ?';
    pool.query(sql, [stateName], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
};

export const deleteRelationsByOfferId = (offerId) => {
  return new Promise((resolve, reject) => {
    pool.query('DELETE FROM offer_state_relations WHERE offer_id = ?', [offerId], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};