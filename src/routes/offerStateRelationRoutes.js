import express from 'express';
import {
  getOfferCurrentState,
  getOfferStateHistory
} from '../controllers/offerStateRelationController.js';

const router = express.Router();

// Ruta para obtener el estado actual de una oferta específica
router.get('/:offerId/current', getOfferCurrentState);

// Ruta para obtener el historial de estados de una oferta específica
router.get('/:offerId/history', getOfferStateHistory);

export default router;