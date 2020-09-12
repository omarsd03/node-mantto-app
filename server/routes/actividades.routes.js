const express = require('express');
const router = express.Router();

const actividades = require('../controllers/actividades.controller');
const mdAutenticacion = require("../middlewares/autenticacion");

router.post('/pendientes', mdAutenticacion.verifyToken, actividades.obtenerPendientes);
router.post('/actividades', mdAutenticacion.verifyToken, actividades.obtenerActividades);
router.post('/actividad', mdAutenticacion.verifyToken, actividades.obtenerActividad);
router.post('/realizar', mdAutenticacion.verifyToken, actividades.realizarActividad);
router.post('/realizadas', mdAutenticacion.verifyToken, actividades.obtenerRealizadas);
router.post('/anomalias', mdAutenticacion.verifyToken, actividades.obtenerAnomalias);

router.post('/historico', mdAutenticacion.verifyToken, actividades.historico);

router.post('/upload', mdAutenticacion.verifyToken, actividades.cargarFoto);

router.post('/coordinarAnomalia', mdAutenticacion.verifyToken, actividades.coordinarAnomalia);
router.post('/agregarAcciones', mdAutenticacion.verifyToken, actividades.agregarAcciones);

module.exports = router;