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
    pool.query('SELECT * FROM offers WHERE id = ?', [id], (error, results) => {
      if (error) reject(error);
      else resolve(results[0]);  // Supone que solo se devuelve un registro
    });
  });
};

export const createOffer = (offer) => {
  const { user_id, title, description, company, location, link_offer, stack_required, notes, interest, modality, creation_date } = offer;
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO offers (user_id, title, description, company, location, link_offer, stack_required, notes, interest, modality, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, title, description, company, location, link_offer, stack_required, notes, interest, modality, creation_date],
      (error, results) => {
        if (error) reject(error);
        else resolve({ id: results.insertId, ...offer });
      }
    );
  });
};

export const updateOffer = (id, offer) => {
  const { title, description, company, location, link_offer, stack_required, notes, interest, modality, creation_date } = offer;
  return new Promise((resolve, reject) => {
    pool.query(
      'UPDATE offers SET title = ?, description = ?, company = ?, location = ?, link_offer = ?, stack_required = ?, notes = ?, interest = ?, modality = ?, creation_date = ? WHERE id = ?',
      [title, description, company, location, link_offer, stack_required, notes, interest, modality, creation_date, id],
      (error) => {
        if (error) reject(error);
        else resolve({ id, ...offer });
      }
    );
  });
};

export const deleteOffer = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('DELETE FROM offers WHERE id = ?', [id], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};
