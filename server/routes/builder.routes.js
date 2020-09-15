const express = require('express');
const router = express.Router();

const builder = require('../controllers/builder.controller');
const mdAutenticacion = require("../middlewares/autenticacion");

router.post('/checkbox', mdAutenticacion.verifyToken, builder.obtenerCheckbox);
router.post('/responsables', mdAutenticacion.verifyToken, builder.obtenerResponsables);
router.post('/acciones', mdAutenticacion.verifyToken, builder.obtenerAcciones);

router.post('/detalleOk', mdAutenticacion.verifyToken, builder.detalleOk);
router.post('/detalleNok', mdAutenticacion.verifyToken, builder.detalleNok);

module.exports = router;