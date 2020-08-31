const sql = require("mssql");
const config = require('../database');
const jwt = require("jsonwebtoken");
const SEED = require("../config/config").SEED;

const { generarJWT } = require('../helpers/jwt');
const { getMenuFrontend } = require('../helpers/menu-frontend');

const userCtrl = {};

userCtrl.signIn = async(req, res) => {

    const { sgi, password } = req.body;

    // // connect to your database
    await sql.connect(config, function(err) {

        const ps = new sql.PreparedStatement()
        ps.input('sgi', sql.VarChar)
        ps.input('password', sql.VarChar)
        ps.prepare('SELECT * FROM d_mantto_users WHERE user_sgi = @sgi AND user_password = @password', err => {

            ps.execute({ sgi: sgi, password: password }, (err, result) => {

                if (err) return res.status(401).send(err);

                if (result.rowsAffected[0] > 0) {

                    const user = result.recordset[0];
                    console.log(user);
                    // const token = jwt.sign({ _id: user.id_user }, SEED, { expiresIn: 14400 });
                    const token = jwt.sign({ _id: user.id_user }, SEED, { expiresIn: '12h' });
                    user.user_password = ':)';

                    return res.status(200).json({ ok: true, user, token, menu: getMenuFrontend(user.user_role) });

                } else {
                    return res.status(404).json({ ok: false, message: "Credenciales incorrectas" });
                }

            });

        });

    });

}

module.exports = userCtrl;