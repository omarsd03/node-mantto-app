const sql = require("mssql");
const config = require('../database');

const builderCtrl = {};

builderCtrl.obtenerCheckbox = async(req, res) => {

    const { sgi, role } = req.body;

    let registros = [];

    await new sql.ConnectionPool(config).connect().then(pool => {

        return pool.query `SELECT id_catalogo AS id, c_nombre AS value FROM c_mantto_general WHERE c_categoria = 'Anomalia'`

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

// builderCtrl.obtenerResponsables = async(req, res) => {

//     const { sgi, role } = req.body;

//     let registros = [];

//     await new sql.ConnectionPool(config).connect().then(pool => {

//         return pool.query `SELECT user_sgi AS sgi, user_name AS nombre FROM d_mantto_users WHERE user_role = 'Responsable'`

//     }).then(result => {

//         for (let i = 0; i < result.rowsAffected; i++) {
//             const registro = result.recordset[i];
//             registros.push(registro);
//         }

//         return res.status(200).json({ ok: true, registros: registros });

//     }).catch(err => {
//         if (err) return res.status(401).json(err);
//     })

// }

builderCtrl.obtenerAcciones = async(req, res) => {

    const { sgi, role, folio, id_sub_maquina } = req.body;

    // let registros = [];

    const pool1 = new sql.ConnectionPool(config);
    const pool1Connect = pool1.connect();

    pool1.on('error', err => {
        return res.status(401).send(err);
    });

    async function handlerObtenerAcciones() {

        const acciones = [];
        await pool1Connect;

        try {

            const request = pool1.request();

            const result = await request.query(`SELECT ac_comment AS accion, CONVERT(varchar, ac_fecha_registro, 106) AS fecha_registro FROM d_mantto_anomalias_comments WHERE ac_folio = '${folio}' AND ac_sub_maquina = '${id_sub_maquina}'`);

            for (let i = 0; i < result.rowsAffected; i++) {
                acciones.push(result.recordset[i]);
            }

            return acciones;

        } catch (error) {
            console.log('SQL error', error);
        }
    }

    const registros = await handlerObtenerAcciones();
    return res.status(200).json({ ok: true, registros: registros });

    // // connect to your database
    // await sql.connect(config, function(err) {

    //     if (err) return res.status(401).send(err);

    //     const ps = new sql.PreparedStatement();

    //     ps.input('folio', sql.VarChar).input('id_sub_maquina', sql.VarChar)
    //     ps.prepare('SELECT ac_comment AS accion, CONVERT(varchar, ac_fecha_registro, 106) AS fecha_registro FROM d_mantto_anomalias_comments WHERE ac_folio = @folio AND ac_sub_maquina = @id_sub_maquina', err => {

    //         if (err) return res.status(401).send(err);

    //         ps.execute({ folio: folio, id_sub_maquina: id_sub_maquina }, (err, result) => {

    //             if (err) return res.status(401).send(err);

    //             for (let i = 0; i < result.rowsAffected; i++) {
    //                 registros.push(result.recordset[i]);
    //             }

    //             return res.status(200).json({ ok: true, registros: registros });

    //         });

    //     });

    // });

}

builderCtrl.detalleOk = async(req, res) => {

    const { sgi, role, folio, id_sub_maquina } = req.body;

    const pool1 = new sql.ConnectionPool(config);
    const pool1Connect = pool1.connect();

    pool1.on('error', err => {
        return res.status(401).send(err);
    });

    async function detalleOk() {

        // const registros = [];
        await pool1Connect;

        try {

            const request = pool1.request();

            const result1 = await request.query(`SELECT a.a_zona_maquina, m.m_maquina, a.a_prioridad, a.a_tarea FROM d_mantto_sub_maquinas sm INNER JOIN c_mantto_actividades a ON sm.s_actividad = a.id_actividad INNER JOIN c_mantto_maquinas m ON sm.s_maquina = m.id_maquina WHERE sm.s_folio = '${folio}' AND sm.s_id_sub_maquina = ${id_sub_maquina}`);
            console.log(result1);
            const datos = result1.recordset;
            // registros.push(result1.recordset[0]);

            const result2 = await request.query(`SELECT path FROM d_mantto_evidencias e INNER JOIN master_files f ON e.e_archivo = f.id_file WHERE folio = '${folio}' AND e_sub_maquina = ${id_sub_maquina}`);
            const images = result2.recordset;

            const registros = { datos, images };

            return registros;

        } catch (error) {
            console.log('SQL error', error);
        }
    }

    const registros = await detalleOk();
    return res.status(200).json({ ok: true, registros: registros });

}

builderCtrl.detalleNok = async(req, res) => {

    const { sgi, role, folio, id_sub_maquina } = req.body;

    const pool1 = new sql.ConnectionPool(config);
    const pool1Connect = pool1.connect();

    pool1.on('error', err => {
        return res.status(401).send(err);
    });

    async function detalleOk() {

        // const registros = [];
        await pool1Connect;

        try {

            const request = pool1.request();

            const result1 = await request.query(`SELECT a.a_zona_maquina, m.m_maquina, a.a_prioridad, a.a_tarea, sm.s_comentarios AS descripcion_anomalia, sm.s_tipo_anomalia, sm.s_clasificacion_anomalia FROM d_mantto_sub_maquinas sm INNER JOIN c_mantto_actividades a ON sm.s_actividad = a.id_actividad INNER JOIN c_mantto_maquinas m ON sm.s_maquina = m.id_maquina WHERE sm.s_folio = '${folio}' AND sm.s_id_sub_maquina = ${id_sub_maquina}`);
            console.log(result1);
            const datos = result1.recordset;
            // registros.push(result1.recordset[0]);

            const result2 = await request.query(`SELECT anm_categoria AS categoria_anomalia FROM d_mantto_anm_categorias WHERE anm_folio = '${folio}' AND anm_sub_maquina = ${id_sub_maquina}`);
            const categorias = result2.recordset;

            const result3 = await request.query(`SELECT path FROM d_mantto_evidencias e INNER JOIN master_files f ON e.e_archivo = f.id_file WHERE folio = '${folio}' AND e_sub_maquina = ${id_sub_maquina}`);
            const images = result3.recordset;

            const registros = { datos, categorias, images };

            return registros;

        } catch (error) {
            console.log('SQL error', error);
        }
    }

    const registros = await detalleOk();
    return res.status(200).json({ ok: true, registros: registros });

}

module.exports = builderCtrl;