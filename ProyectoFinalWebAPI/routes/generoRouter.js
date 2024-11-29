const express = require('express');
const router = express.Router();
const generoController = require('../controllers/generoController');

// Ruta para obtener un género por ID
router.get('/:generoid', generoController.getGeneroById);

// Ruta para agregar un nuevo género
router.post('/', generoController.addGenero);

// Ruta para eliminar un género por ID
router.delete('/:generoid', generoController.deleteGenero);

// Ruta para obtener todos los géneros
router.get('/', generoController.getGeneros);

router.put('/', generoController.updateGenero);

module.exports = router;
