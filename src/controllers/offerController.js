import * as OfferModel from '../models/Offer.js';

export const getAllOffers = async (req, res) => {
  try {
    const offers = await OfferModel.findAllOffers();
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Error getting offers', error });
  }
};

export const getOfferById = async (req, res) => {
  try {
    const offer = await OfferModel.findOfferById(req.params.id);
    if (offer) res.json(offer);
    else res.status(404).json({ message: 'Offer not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error getting offer', error });
  }
};

export const createOffer = async (req, res) => {
  try {
    const newOffer = await OfferModel.createOffer({ ...req.body, user_id: req.user.id });
    res.status(201).json(newOffer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating offer', error });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const updatedOffer = await OfferModel.updateOffer(req.params.id, req.body);
    res.json(updatedOffer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating offer', error });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    await OfferModel.deleteOffer(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting offer', error });
  }
};
