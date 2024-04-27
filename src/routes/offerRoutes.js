import express from 'express';
import { getAllOffers, getOfferById, createOffer, updateOffer, deleteOffer } from '../controllers/offerController.js';

const router = express.Router();

router.get('/', getAllOffers);
router.get('/:id', getOfferById);
router.post('/', createOffer);
router.put('/:id', updateOffer);
router.delete('/:id', deleteOffer);

export default router;
