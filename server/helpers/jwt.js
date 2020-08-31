const jwt = require('jsonwebtoken');

const SEED = require("../config/config").SEED;

const generarJWT = async(id) => {

    return new Promise((resolve, reject) => {

        const payload = {
            id,
        };

        jwt.sign(payload, SEED, {
            expiresIn: '12h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }

        });

    });

}


module.exports = {
    generarJWT,
}