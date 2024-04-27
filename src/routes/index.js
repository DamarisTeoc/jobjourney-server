const express = require('express');
const router = express.Router();

// Aquí se importarían los controladores
// const userController = require('../controllers/userController');

router.get('/', (req, res) => {
  res.send('Bienvenido a JOB JOURNEY SERVER!');
});

// Definir otras rutas, por ejemplo:
// router.get('/users', userController.list);

module.exports = router;