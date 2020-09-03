const sql = require("mssql");
const config = require('../database');

const builderCtrl = {};

builderCtrl.obtenerCheckbox = async(req, res) => {

    const { sgi, role, categoria } = req.body;

    let registros = [];

    await new sql.ConnectionPool(config).connect().then(pool => {

        if (categoria == 'Seguridad') {
            return pool.query `SELECT id_catalogo AS id, c_nombre AS value FROM c_mantto_general WHERE c_categoria LIKE '%Seguridad%' AND c_tipo = 'Anomalia'`
        } else if (categoria == 'Mantenimiento') {
            return pool.query `SELECT id_catalogo AS id, c_nombre AS value FROM c_mantto_general WHERE c_categoria LIKE '%Mantenimiento%' AND c_tipo = 'Anomalia'`
        } else if (categoria == 'Produccion') {
            return pool.query `SELECT id_catalogo AS id, c_nombre AS value FROM c_mantto_general WHERE c_categoria LIKE '%Produccion%' AND c_tipo = 'Anomalia'`
        } else {
            return res.status(400).json({ ok: false, mensaje: 'Categoria invalida' });
        }

    }).then(result => {

        for (let i = 0; i < result.rowsAffected; i++) {
            const registro = result.recordset[i];
            registros.push(registro);
        }

        return res.status(200).json({ ok: true, registros: registros });

    }).catch(err => {
        if (err) return res.status(401).json(err);
    })

}

builderCtrl.obtenerResponsables = async(req, res) => {

    const { sgi, role } = req.body;

    let registros = [];

    await new sql.ConnectionPool(config).connect().then(pool => {

        return pool.query `SELECT user_sgi AS sgi, user_name AS nombre FROM d_mantto_users WHERE user_role = 'Responsable'`

    }).then(result => {

        for (let i = 0; i < result.rowsAffected; i++) {
            const registro = result.recordset[i];
            registros.push(registro);
        }

        return res.status(200).json({ ok: true, registros: registros });

    }).catch(err => {
        if (err) return res.status(401).json(err);
    })

}

module.exports = builderCtrl;