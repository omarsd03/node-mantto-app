const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

// ========================================
// Verificar Token
// ========================================
exports.verifyToken = async function(req, res, next) {
    try {
        if (!req.headers.authorization) {
            // return res.status(401).send('Token no valido');
            return res.status(401).json({
                ok: false,
                mensaje: "Token no valido",
            });
        }
        let token = req.headers.authorization.split(' ')[1];
        if (token === 'null') {
            // return res.status(401).send('Token no valido');
            return res.status(401).json({
                ok: false,
                mensaje: "Token no valido",
            });
        }

        const payload = await jwt.verify(token, SEED);
        if (!payload) {
            // return res.status(401).send('Token no valido');
            return res.status(401).json({
                ok: false,
                mensaje: "Token no valido",
            });
        }
        req.userId = payload._id;
        next();
    } catch (e) {
        //console.log(e)
        // return res.status(401).send('Token no valido');
        return res.status(401).json({
            ok: false,
            mensaje: "Token no valido",
            errors: e,
        });
    }
}