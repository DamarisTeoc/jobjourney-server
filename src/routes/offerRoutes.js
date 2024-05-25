import express from 'express';
import { getAllOffers, getOfferById, createOffer, updateOffer, deleteOffer } from '../controllers/offerController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

router.get('/', authenticateToken, getAllOffers);
router.get('/:id', authenticateToken, getOfferById);
router.post('/', authenticateToken, createOffer);
router.put('/:id', authenticateToken, updateOffer);
router.delete('/:id', authenticateToken, deleteOffer);


export default router;
