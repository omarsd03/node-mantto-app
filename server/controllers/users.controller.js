const sql = require("mssql");
const config = require('../database');
const jwt = require("jsonwebtoken");
const SEED = require("../config/config").SEED;

const { generarJWT } = require('../helpers/jwt');
const { getMenuFrontend } = require('../helpers/menu-frontend');

const userCtrl = {};

userCtrl.signIn = async(req, res) => {

    const { sgi, password } = req.body;

    const pool1 = new sql.ConnectionPool(config);
    const pool1Connect = pool1.connect();

    pool1.on('error', err => {
        return res.status(401).send(err);
    });

    async function handlerSignIn() {

        // const registros = [];
        await pool1Connect;

        try {

            const request = pool1.request();

            const result = await request.query(`SELECT * FROM d_mantto_users WHERE user_sgi = '${sgi}' AND user_password = '${password}'`);
            console.log(result);
            // const datos = result1.recordset;

            if (result.rowsAffected[0] > 0) {

                const user = result.recordset[0];
                console.log(user);
                return user;

            } else {
                return false;
            }

        } catch (error) {
            console.log('SQL error', error);
        }
    }

    const user = await handlerSignIn();

    if (user) {

        const token = jwt.sign({ _id: user.id_user }, SEED, { expiresIn: '12h' });
        user.user_password = ':)';

        return res.status(200).json({ ok: true, user, token, menu: getMenuFrontend(user.user_role) });

    } else {
        return res.status(404).json({ ok: false, message: "Credenciales incorrectas" });
    }

}

module.exports = userCtrl;