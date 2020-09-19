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

    console.log(req.body);

    const { subscription, sgi, role } = req.body;
    // console.log(suscripcion, sgi, role);
    const suscribir = await push.addSubscription(subscription, sgi, role);
    console.log(suscribir);
    if (suscribir) {
        res.status(200).json({ ok: true, 'message': 'Suscrito correctamente' });
    } else {
        res.status(401).json({ ok: false, 'message': 'Error en la suscripcion' });
    }
    // res.json('suscrito');

}

pushCtrl.enviarNotificacion = async(req, res) => {

    const post = {
        titulo: req.body.titulo,
        cuerpo: req.body.cuerpo
    };

    await push.sendPush(post);

    res.json('Notificacion enviada');

}

module.exports = pushCtrl;