import express from 'express';
import {
  getOfferCurrentState,
  getOfferStateHistory,
  updateOfferState,
  getAllOfferStates
} from '../controllers/offerStateRelationController.js';

const router = express.Router();

router.get('/:offerId/current', getOfferCurrentState);
router.get('/:offerId/history', getOfferStateHistory);
router.post('/update', updateOfferState);
router.get('/', getAllOfferStates);

export default router;