const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

router.get('/:administradorid', adminController.getAdminByUserId);

module.exports = router;