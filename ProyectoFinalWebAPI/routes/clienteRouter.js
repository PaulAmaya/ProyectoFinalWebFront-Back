const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/clienteController');

//GET /api/cliente/usuario/1
router.get('/usuario/:clientId', clienteController.getUserClients);

//GET /api/cliente/1
router.get('/:clienteid', clienteController.getClienteById);

//GET /api/cliente
router.get('/', clienteController.getAllClients);

//POST /api/cliente
router.post('/', clienteController.createClient);

//PUT /api/cliente
router.put('/usuario/:clienteId', clienteController.updateClient);

//DELETE /api/cliente/1
router.delete('/:clientId', clienteController.deleteClient);

router.delete('/carrito/:clienteId', clienteController.deleteCarritoByClienteId);

router.put('/pedido/:clienteId', clienteController.updateEstadoPedidoByClienteId);

module.exports = router;
