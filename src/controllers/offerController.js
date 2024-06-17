import * as OfferModel from '../models/Offer.js';
import * as OfferStateRelationModel from '../models/OfferStateRelation.js';

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

export const getOffersByUserId = async (req, res) => {
  const { user_id } = req.query;
  try {
    const offers = await OfferModel.getOffersByUserId(user_id);
    console.log('Fetched offers from DB:', offers);  // Verifica los resultados aquí
    res.json(offers);  // Asegúrate de que se está enviando la respuesta correcta
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'Error fetching offers', error });
  }
};

export const createOffer = async (req, res) => {
  try {
    const newOffer = await OfferModel.createOffer({ ...req.body, user_id: req.user.user_id });
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
    const offerId = req.params.id;

    // Primero, eliminar las relaciones de estado de la oferta
    await OfferStateRelationModel.deleteRelationsByOfferId(offerId);

    // Luego, eliminar la oferta
    await OfferModel.deleteOffer(offerId);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting offer', error });
  }
};