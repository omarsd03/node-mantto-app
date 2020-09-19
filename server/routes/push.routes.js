const express = require('express');
const router = express.Router();

const push = require('../controllers/push.controller');
const mdAutenticacion = require("../middlewares/autenticacion");

router.get('/key', mdAutenticacion.verifyToken, push.obtenerKey);
router.post('/subscribe', mdAutenticacion.verifyToken, push.obtenerSuscripcion)
router.post('/push', push.enviarNotificacion)

module.exports = router;