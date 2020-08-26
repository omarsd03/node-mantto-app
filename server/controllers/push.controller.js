const push = require('../push');

const pushCtrl = {};

pushCtrl.obtenerKey = async (req, res) => {

    const key = push.getKey();
    res.send(key);

};

pushCtrl.obtenerSuscripcion = async (req, res) => {

    const suscripcion = req.body;
    push.addSubscription(suscripcion);
    res.json('suscrito');

}

module.exports = pushCtrl;