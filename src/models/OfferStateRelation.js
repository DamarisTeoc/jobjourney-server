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
