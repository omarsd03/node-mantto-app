const express = require('express');
const router = express.Router();

const push = require('../controllers/push.controller');
const mdAutenticacion = require("../middlewares/autenticacion");

router.get('/key', mdAutenticacion.verifyToken, push.obtenerKey);
router.post('/subscribe', mdAutenticacion.verifyToken, push.obtenerSuscripcion)

module.exports = router;