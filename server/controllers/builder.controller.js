const sql = require("mssql");
const config = require('../database');

const builderCtrl = {};

builderCtrl.obtenerCheckbox = async(req, res) => {

    const { sgi, role } = req.body;

    let registros = [];

    await new sql.ConnectionPool(config).connect().then(pool => {

        return pool.query `SELECT id_catalogo AS id, c_nombre AS value FROM c_mantto_general WHERE c_categoria LIKE '%Mantenimiento%' AND c_tipo = 'Anomalia'`

        // if (categoria == 'Seguridad') {
        //     return pool.query `SELECT id_catalogo AS id, c_nombre AS value FROM c_mantto_general WHERE c_categoria LIKE '%Seguridad%' AND c_tipo = 'Anomalia'`
        // } else if (categoria == 'Mantenimiento') {
        //     return pool.query `SELECT id_catalogo AS id, c_nombre AS value FROM c_mantto_general WHERE c_categoria LIKE '%Mantenimiento%' AND c_tipo = 'Anomalia'`
        // } else if (categoria == 'Produccion') {
        //     return pool.query `SELECT id_catalogo AS id, c_nombre AS value FROM c_mantto_general WHERE c_categoria LIKE '%Produccion%' AND c_tipo = 'Anomalia'`
        // } else {
        //     return res.status(400).json({ ok: false, mensaje: 'Categoria invalida' });
        // }

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

builderCtrl.obtenerAcciones = async(req, res) => {

    const { sgi, role, folio, id_sub_maquina } = req.body;

    let registros = [];

    // // connect to your database
    await sql.connect(config, function(err) {

        if (err) return res.status(401).send(err);

        const ps = new sql.PreparedStatement();

        ps.input('folio', sql.VarChar).input('id_sub_maquina', sql.VarChar)
        ps.prepare('SELECT ac_comment AS accion, CONVERT(varchar, ac_fecha_registro, 106) AS fecha_registro FROM d_mantto_anomalias_comments WHERE ac_folio = @folio AND ac_sub_maquina = @id_sub_maquina', err => {

            if (err) return res.status(401).send(err);

            ps.execute({ folio: folio, id_sub_maquina: id_sub_maquina }, (err, result) => {

                if (err) return res.status(401).send(err);

                for (let i = 0; i < result.rowsAffected; i++) {
                    registros.push(result.recordset[i]);
                }

                return res.status(200).json({ ok: true, registros: registros });

            });

        });

    });

}

module.exports = builderCtrl;