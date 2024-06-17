import * as OfferStateRelationModel from '../models/OfferStateRelation.js';
import * as OfferModel from '../models/Offer.js'; 


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

export const updateOfferState = async (req, res) => {
  const { offer_id, newState } = req.body;
  try {
    const state = await OfferModel.getStateByName(newState);
    if (!state) {
      return res.status(400).json({ message: 'Invalid state' });
    }
    await OfferStateRelationModel.updateOfferState(offer_id, state.state_id);
    res.status(200).json({ message: 'State updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating offer state', error });
  }
};

export const getAllOfferStates = async (req, res) => {
  try {
    const states = await OfferStateRelationModel.getAllStates();
    res.json(states);
  } catch (error) {
    res.status(500).json({ message: 'Error getting offer states', error });
  }
};

export const deleteOfferStateRelations = async (req, res) => {
  const { offerId } = req.params;
  try {
    await OfferStateRelationModel.deleteRelationsByOfferId(offerId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting offer state relations', error });
  }
};
