const express = require('express');
const router = express.Router();

const detalleController = require('../controllers/detalleController');

// Ruta para obtener un detalle por ID
router.get('/:id', detalleController.getDetalleById);

router.delete('/:id', detalleController.deleteDetalle);

router.put('/:id', detalleController.updateCantidadDetalle);



module.exports = router;