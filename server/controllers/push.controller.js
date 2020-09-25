const push = require('../push');

const pushCtrl = {};

pushCtrl.obtenerKey = async(req, res) => {

    const key = vapid.publicKey;
    res.json({ ok: true, key: key });

};

pushCtrl.obtenerKey = async(req, res) => {

    const key = push.getKey();
    res.send(key);

};

pushCtrl.obtenerSuscripcion = async(req, res) => {

    const subscription = req.body.sub;
    const { sgi, role } = req.body;
    push.addSubscription(subscription, sgi, role);
    res.json('suscrito');

}

pushCtrl.enviarNotificacion = async(req, res) => {

    const post = {
        titulo: req.body.titulo,
        cuerpo: req.body.cuerpo
    };

    const { sgi, role } = req.body;

    push.sendPush(post, sgi, role);

    res.json('Notificacion enviada');

}

module.exports = pushCtrl;