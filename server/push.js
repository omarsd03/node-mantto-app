const fs = require('fs');
const sql = require("mssql");
const config = require('./database');

const urlsafeBase64 = require('urlsafe-base64');
const vapid = require('./vapid.json');

const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:Omar.Salgado@saint-gobain.com',
    vapid.publicKey,
    vapid.privateKey
);

let suscripciones = require('./subs-db.json');

module.exports.getKey = () => {
    return urlsafeBase64.decode(vapid.publicKey);
};

module.exports.addSubscription = async(suscripcion, sgi, role) => {

    console.log(suscripcion);

    suscripciones.push(suscripcion);

    const pool1 = new sql.ConnectionPool(config);
    const pool1Connect = pool1.connect();

    pool1.on('error', err => {
        return res.status(401).send(err);
    });

    async function agregarSuscripcion() {

        // const registros = [];
        await pool1Connect;

        try {

            const request = pool1.request();

            const result1 = await request.query(`UPDATE d_mantto_users SET user_payload = '${JSON.stringify(suscripcion)}' WHERE user_sgi = '${sgi}'`);
            console.log(result1);
            // registros.push(result1.recordset[0]);

            return true;

        } catch (error) {
            console.log('SQL error', error);
        }
    }

    const registros = await agregarSuscripcion();
    if (registros) {
        return true;
    } else {
        return false;
    }

    // fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscripciones));

};

module.exports.sendPush = async(post) => {

    console.log('Mandando PUSHES');

    const pool1 = new sql.ConnectionPool(config);
    const pool1Connect = pool1.connect();

    pool1.on('error', err => {
        return res.status(401).send(err);
    });

    async function obtenerSuscripciones() {

        const registros = [];
        await pool1Connect;

        try {

            const request = pool1.request();

            const result1 = await request.query(`SELECT user_payload FROM d_mantto_users WHERE user_payload <> 'NULL'`);
            // console.log(result1);
            // registros.push(result1.recordset);

            for (let i = 0; i < result1.rowsAffected; i++) {
                registros.push(result1.recordset[i]);
            }

            return registros;

        } catch (error) {
            console.log('SQL error', error);
        }
    }

    const suscripciones = await obtenerSuscripciones();
    // console.log(suscripciones);

    if (suscripciones.length > 0) {

        suscripciones.forEach((suscripcion, i) => {

            // const pushProm = webpush.sendNotification(suscripcion.user_payload, JSON.stringify(post)).then(console.log('Notificacion enviada')).catch(err => {
            const pushProm = webpush.sendNotification(JSON.parse(suscripcion.user_payload), JSON.stringify(post)).then(console.log('Notificacion enviada')).catch(err => {

                console.log(err);

                console.log('Notificacion fallo');

                // if (err.statusCode === 410) { // GONE, ya no existe
                //     suscripciones[i].borrar = true;
                // }

            });

            // notificacionesEnviadas.push(pushProm);

        });


        // Promise.all(notificacionesEnviadas).then(() => {

        //     suscripciones = suscripciones.filter(subs => !subs.borrar);
        //     fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscripciones));

        // });

    } else {
        return false;
    }

    // const notificacionesEnviadas = [];

    // suscripciones.forEach((suscripcion, i) => {

    //     const pushProm = webpush.sendNotification(suscripcion, JSON.stringify(post)).then(console.log('Notificacion enviada')).catch(err => {

    //         console.log(err);

    //         console.log('Notificacion fallo');

    //         if (err.statusCode === 410) { // GONE, ya no existe
    //             suscripciones[i].borrar = true;
    //         }

    //     });

    //     notificacionesEnviadas.push(pushProm);

    // });


    // Promise.all(notificacionesEnviadas).then(() => {

    //     suscripciones = suscripciones.filter(subs => !subs.borrar);
    //     fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscripciones));

    // });

};