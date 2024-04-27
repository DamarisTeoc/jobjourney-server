import * as OfferStateRelationModel from '../models/OfferStateRelation.js';

export const getOfferCurrentState = async (req, res) => {
  const { offerId } = req.params;
  try {
    const currentState = await OfferStateRelationModel.getCurrentStateByOfferId(offerId);
    res.json(currentState);
  } catch (error) {
    res.status(500).json({ message: 'Error getting current state', error });
  }
};

export const getOfferStateHistory = async (req, res) => {
  const { offerId } = req.params;
  try {
    const stateHistory = await OfferStateRelationModel.getStateHistoryByOfferId(offerId);
    res.json(stateHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error getting state history', error });
  }
};

