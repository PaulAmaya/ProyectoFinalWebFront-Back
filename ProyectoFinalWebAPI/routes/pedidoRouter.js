const express = require('express');
const router = express.Router();


const pedidoController = require('../controllers/pedidoController');

// Ruta para crear un pedido
router.post('/realizar', pedidoController.realizarPedido);

// Ruta para obtener un pedido por ID
router.get('/:id', pedidoController.getPedidoById);

// Ruta para eliminar un pedido por ID
router.delete('/:id', pedidoController.deletePedido);

router.get('/cliente/:id', pedidoController.getPedidosByUserId);

router.get('/', pedidoController.getPedidoWithDetails);

module.exports = router;