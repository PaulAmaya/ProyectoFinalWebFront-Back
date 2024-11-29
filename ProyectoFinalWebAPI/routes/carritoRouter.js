const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');



// Ruta para obtener un carrito por el ID del usuario (cliente)
router.get('/:usuarioid', carritoController.getCarritoDatosCliente);

//solo puede funcionar o el getcarritoid o el getcarritodatoscliente
router.get('/cliente/:clienteId', carritoController.getCarritoByClienteId);

module.exports = router;
