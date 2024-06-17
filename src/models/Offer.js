import pool from './database.js';

export const findAllOffers = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM offers', (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

export const findOfferById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM offers WHERE offer_id = ?', [id], (error, results) => {
      if (error) reject(error);
      else resolve(results[0]);
    });
  });
};

export const createOffer = (offer) => {
  const { user_id, title, description, company, location, link_offer, stack_required, notes, interest, modality, created_at } = offer;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);

      connection.beginTransaction((transactionError) => {
        if (transactionError) {
          connection.release();
          reject(transactionError);
        }

        connection.query(
          'INSERT INTO offers (user_id, title, description, company, location, link_offer, stack_required, notes, interest, modality, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [user_id, title, description, company, location, link_offer, stack_required, notes, interest, modality, created_at],
          (error, results) => {
            if (error) {
              return connection.rollback(() => {
                connection.release();
                reject(error);
              });
            }

            const offer_id = results.insertId;
            const initialStateId = 1; // Ajusta según el estado inicial correspondiente

            connection.query(
              'INSERT INTO offer_state_relations (offer_id, state_id, moved_at) VALUES (?, ?, NOW())',
              [offer_id, initialStateId],
              (stateError) => {
                if (stateError) {
                  return connection.rollback(() => {
                    connection.release();
                    reject(stateError);
                  });
                }

                connection.commit((commitError) => {
                  if (commitError) {
                    return connection.rollback(() => {
                      connection.release();
                      reject(commitError);
                    });
                  }

                  connection.release();
                  resolve({ offer_id, ...offer });
                });
              }
            );
          }
        );
      });
    });
  });
};

export const updateOffer = (id, offer) => {
  const { title, description, company, location, link_offer, stack_required, notes, interest, modality, created_at } = offer;
  return new Promise((resolve, reject) => {
    pool.query(
      'UPDATE offers SET title = ?, description = ?, company = ?, location = ?, link_offer = ?, stack_required = ?, notes = ?, interest = ?, modality = ?, created_at = ? WHERE offer_id = ?',
      [title, description, company, location, link_offer, stack_required, notes, interest, modality, created_at, id],
      (error) => {
        if (error) reject(error);
        else resolve({ offer_id: id, ...offer });
      }
    );
  });
};

export const deleteOffer = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('DELETE FROM offers WHERE offer_id = ?', [id], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

export const getOffersByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT o.*, os.name as state
      FROM offers o
      LEFT JOIN (
        SELECT osr.offer_id, os.name
        FROM offer_state_relations osr
        JOIN offer_states os ON osr.state_id = os.state_id
        WHERE osr.moved_at = (
          SELECT MAX(moved_at)
          FROM offer_state_relations
          WHERE offer_id = osr.offer_id
        )
      ) os ON o.offer_id = os.offer_id
      WHERE o.user_id = ?;
    `;
    pool.query(sql, [userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        console.log('Query Results:', results);
        resolve(results);
      }
    });
  });
};