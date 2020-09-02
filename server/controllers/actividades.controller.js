const sql = require("mssql");
const config = require('../database');
const { v4: uuidv4 } = require('uuid');

const actividadesCtrl = {};

actividadesCtrl.obtenerPendientes = async(req, res) => {

    const { sgi, role } = req.body;
    let registros = [];

    if (role == "Operador") {

        // connect to your database
        await sql.connect(config, function(err) {

            if (err) return res.status(401).send(err);

            let ps = new sql.PreparedStatement();
            ps.input('sgi', sql.VarChar);
            ps.input('status', sql.VarChar);
            ps.prepare('SELECT g.g_folio, m.id_maquina, m.m_maquina, a.id_actividad, a.a_prioridad, a.a_zona_maquina, a.a_tarea, a.a_maquina_parada, g.g_operador, g.g_total_pendientes FROM d_mantto_general g LEFT JOIN c_mantto_actividades a ON g.g_actividad = a.id_actividad RIGHT JOIN c_mantto_maquinas m ON g.g_maquina = m.id_maquina WHERE g.g_operador = @sgi AND g.g_status_now = @status', err => {

                if (err) return res.status(401).send(err);

                ps.execute({ sgi: sgi, status: 'Pendiente' }, (err, result) => {

                    if (err) return res.status(401).send(err);

                    for (let i = 0; i < result.rowsAffected; i++) {
                        registros.push(result.recordset[i]);
                    }

                    return res.status(200).json({ ok: true, registros: registros });

                });

            });

        });

    }

    if (role == 'Interceptor') {

        await sql.connect(config, function(err) {

            if (err) return res.status(401).send(err);

            let sttmt = new sql.PreparedStatement();
            sttmt.input('role', sql.VarChar).input('status', sql.VarChar);
            sttmt.prepare('SELECT dsm.s_folio AS folio, dsm.s_maquina AS maquina, a.a_zona_maquina AS zona_maquina, dsm.s_actividad AS actividad, csm.s_nombre AS nombre, dsm.s_id_sub_maquina AS id_sub_maquina, a.a_prioridad AS prioridad, a.a_tarea AS tarea, dsm.s_tipo_anomalia AS tipo_anomalia, dsm.s_clasificacion_anomalia AS clasificacion_anomalia, dsm.s_comentarios AS descripcion_anomalia FROM progress_mantto p LEFT JOIN d_mantto_sub_maquinas dsm ON p.sub_actividad = dsm.s_id_sub_maquina LEFT JOIN c_mantto_sub_maquinas csm ON dsm.s_id_sub_maquina = csm.id_sub_maquina RIGHT JOIN c_mantto_actividades a ON dsm.s_actividad = a.id_actividad WHERE p.role = @role AND p.status = @status', err => {

                if (err) return res.status(401).send(err);

                sttmt.execute({ role: role, status: 'Pendiente' }, (err, result) => {

                    if (err) return res.status(401).send(err);

                    for (let i = 0; i < result.rowsAffected; i++) {
                        registros.push(result.recordset[i]);
                    }

                    return res.status(200).json({ ok: true, registros: registros });

                });

            });

        });

        // sql.connect(config).then(() => {

        //     const status = 'Pendiente';
        //     return sql.query `SELECT dsm.s_folio AS folio, dsm.s_maquina AS maquina, a.a_zona_maquina AS zona_maquina, dsm.s_actividad AS actividad, csm.s_nombre AS nombre, dsm.s_id_sub_maquina AS id_sub_maquina, a.a_prioridad AS prioridad, a.a_tarea AS tarea, dsm.s_tipo_anomalia AS tipo_anomalia, dsm.s_clasificacion_anomalia AS clasificacion_anomalia, dsm.s_comentarios AS descripcion_anomalia FROM progress_mantto p LEFT JOIN d_mantto_sub_maquinas dsm ON p.sub_actividad = dsm.s_id_sub_maquina LEFT JOIN c_mantto_sub_maquinas csm ON dsm.s_id_sub_maquina = csm.id_sub_maquina RIGHT JOIN c_mantto_actividades a ON dsm.s_actividad = a.id_actividad WHERE p.role = ${role} AND p.status = ${status}`

        // }).then(result => {

        //     for (let i = 0; i < result.rowsAffected; i++) {
        //         registros.push(result.recordset[i]);
        //     }

        //     return res.status(200).json({ ok: true, registros: registros });

        // }).catch(err => {
        //     // ... error checks\
        //     if (err) return res.status(401).json(err);
        // })

    }

};

actividadesCtrl.obtenerActividades = async(req, res) => {

    const { folio } = req.body;
    let registros = [];

    await sql.connect(config, function(err) {

        if (err) return res.status(401).send(err);

        let sttmt = new sql.PreparedStatement();

        sttmt.input('folio', sql.VarChar);
        sttmt.input('status', sql.VarChar);
        sttmt.prepare(`SELECT dsm.s_folio AS folio, dsm.s_maquina AS maquina, dsm.s_actividad AS actividad, csm.s_nombre AS nombre, dsm.s_id_sub_maquina AS id_sub_maquina FROM d_mantto_sub_maquinas dsm LEFT JOIN c_mantto_sub_maquinas csm ON dsm.s_id_sub_maquina = csm.id_sub_maquina WHERE s_folio = @folio AND s_status = @status`, err => {

            if (err) return res.status(401).send(err);

            sttmt.execute({ folio: folio, status: 'Pendiente' }, (err, result) => {

                if (err) return res.status(401).send(err);

                for (let i = 0; i < result.rowsAffected; i++) {
                    registros.push(result.recordset[i]);
                }

                return res.status(200).json({ ok: true, registros: registros });

            });

        });

    });

}

actividadesCtrl.obtenerActividad = async(req, res) => {

    const { id_actividad, sgi, folio } = req.body;
    const registros = [];

    await sql.connect(config, function(err) {

        if (err) return res.status(401).send(err);

        let sttmt = new sql.PreparedStatement();

        sttmt.input('id', sql.Int).input('sgi', sql.VarChar).input('folio', sql.VarChar).input('status', sql.VarChar);
        sttmt.prepare(`SELECT sm.id_sub_maquina, sm.s_folio, m.m_maquina, a.a_prioridad, a.a_zona_maquina, a.a_tarea, a.a_maquina_parada, a.a_categoria, u.Name AS a_resp_tarea FROM d_mantto_sub_maquinas sm LEFT JOIN c_mantto_actividades a ON sm.s_actividad = a.id_actividad RIGHT JOIN c_mantto_maquinas m ON sm.s_maquina = m.id_maquina LEFT JOIN users u ON a.a_resp_tarea = u.SGI WHERE sm.s_id_sub_maquina = @id and a.a_resp_tarea = @sgi AND sm.s_folio = @folio AND sm.s_status = @status`, err => {

            if (err) return res.status(401).send(err);

            sttmt.execute({ id: id_actividad, sgi: sgi, folio: folio, status: 'Pendiente' }, (err, result) => {

                if (err) return res.status(401).send(err);

                for (let i = 0; i < result.rowsAffected; i++) {
                    registros.push(result.recordset[i]);
                }

                return res.status(200).json({ ok: true, registros: registros });

            });

        })

    });

}

actividadesCtrl.realizarActividad = async(req, res) => {

    const { id_actividad, folio, opcion, descripcion, rol } = req.body;

    console.log(id_actividad, folio, opcion, descripcion, rol);

    await sql.connect(config, (err) => {

        if (err) return res.status(401).send(err);

        let sttmt = new sql.PreparedStatement();

        if (opcion == 'OK') {

            sttmt.input('id', sql.Int).input('folio', sql.VarChar).input('opcion', sql.VarChar).input('status', sql.VarChar);
            sttmt.prepare(`UPDATE d_mantto_sub_maquinas SET s_status = @opcion WHERE s_id_sub_maquina = @id AND s_folio = @folio AND s_status = @status`, err => {

                if (err) return res.status(401).send(err);

                sttmt.execute({ id: id_actividad, folio: folio, opcion: opcion, status: 'Pendiente' }, (err, result) => {

                    if (err) return res.status(401).send(err);

                    if (result.rowsAffected[0] > 0) {
                        return res.status(200).json({ ok: true, message: 'Actividad Realizada Correctamente!' });
                    } else {
                        return res.status(400).json({ ok: false, message: 'Error al registrar actividad' });
                    }

                });

            });

        } else if (opcion == 'NOK') {

            sttmt.input('id', sql.Int).input('folio', sql.VarChar).input('opcion', sql.VarChar).input('status', sql.VarChar).input('descripcion', sql.VarChar);
            sttmt.prepare(`UPDATE d_mantto_sub_maquinas SET s_status = @opcion, s_comentarios = @descripcion WHERE s_id_sub_maquina = @id AND s_folio = @folio AND s_status = @status`, err => {

                if (err) return res.status(401).send(err);

                sttmt.execute({ id: id_actividad, folio: folio, opcion: opcion, descripcion: descripcion, status: 'Pendiente' }, (err, result) => {

                    if (err) return res.status(401).send(err);

                    if (result.rowsAffected[0] > 0) {

                        sql.connect(config, err => {

                            if (err) return res.status(401).send(err);

                            new sql.Request().input('caso', sql.Int, 1).input('folio', sql.VarChar, folio).input('id_sub_maquina', sql.Int, id_actividad).input('rol', sql.VarChar, rol).execute('NotifyMantto', (err, result) => {
                                console.log(result);
                                res.status(200).json({ ok: true, message: 'Anomalia Registrada!' });
                            });

                        });

                    } else {
                        res.status(400).json({ ok: false, message: 'Error al registrar anomalia' });
                    }

                });

            });

        }

    });

}

actividadesCtrl.obtenerRealizadas = async(req, res) => {

    const { status, sgi } = req.body;
    const registros = [];

    await sql.connect(config, (err) => {

        if (err) return res.status(401).send(err);

        let sttmt = new sql.PreparedStatement();

        sttmt.input('status', sql.VarChar).input('sgi', sql.VarChar);
        sttmt.prepare(`SELECT dsm.s_folio AS folio, dsm.s_maquina AS maquina, dsm.s_actividad AS actividad, csm.s_nombre AS nombre, dsm.s_id_sub_maquina AS id_sub_maquina, a.a_prioridad AS prioridad, a.a_tarea AS tarea FROM d_mantto_sub_maquinas dsm LEFT JOIN c_mantto_sub_maquinas csm ON dsm.s_id_sub_maquina = csm.id_sub_maquina RIGHT JOIN c_mantto_actividades a ON dsm.s_actividad = a.id_actividad WHERE dsm.s_status = @status AND dsm.s_operador = @sgi`, err => {

            if (err) return res.status(401).send(err);

            sttmt.execute({ status: status, sgi: sgi }, (err, result) => {

                if (err) return res.status(401).send(err);

                for (let i = 0; i < result.rowsAffected; i++) {
                    const registro = result.recordset[i];
                    registros.push(registro);
                }

                return res.status(200).json({ ok: true, registros: registros });

            });

        });

    })

}

actividadesCtrl.obtenerAnomalias = async(req, res) => {

    const { status, sgi } = req.body;
    const registros = [];

    await sql.connect(config, (err) => {

        if (err) return res.status(401).send(err);

        let sttmt = new sql.PreparedStatement();

        sttmt.input('status', sql.VarChar).input('sgi', sql.VarChar);
        sttmt.prepare(`SELECT dsm.s_folio AS folio, dsm.s_maquina AS maquina, a.a_zona_maquina AS zona_maquina, dsm.s_actividad AS actividad, csm.s_nombre AS nombre, dsm.s_id_sub_maquina AS id_sub_maquina, a.a_prioridad AS prioridad, a.a_tarea AS tarea, dsm.s_tipo_anomalia AS tipo_anomalia, dsm.s_clasificacion_anomalia AS clasificacion_anomalia, dsm.s_comentarios AS descripcion_anomalia FROM d_mantto_sub_maquinas dsm LEFT JOIN c_mantto_sub_maquinas csm ON dsm.s_id_sub_maquina = csm.id_sub_maquina RIGHT JOIN c_mantto_actividades a ON dsm.s_actividad = a.id_actividad WHERE dsm.s_status = @status AND dsm.s_operador = @sgi`, err => {

            if (err) return res.status(401).send(err);

            sttmt.execute({ status: status, sgi: sgi }, (err, result) => {

                if (err) return res.status(401).send(err);

                for (let i = 0; i < result.rowsAffected; i++) {
                    const registro = result.recordset[i];
                    registros.push(registro);
                }

                return res.status(200).json({ ok: true, registros: registros });

            });

        });

    });

}

actividadesCtrl.cargarFoto = async(req, res) => {

    const { tipo, folio, sgi } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: 'No existen archivos cargados' });
    }

    const file = req.files.archivo;

    const nombreOriginal = file.name;
    const modulo = 43;
    const tipoMasterFiles = 'Evidencia';

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg'];

    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({ ok: false, msg: 'La extension no esta permitida' });
    }

    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;
    const path = `server/uploads/${tipo}/${nombreArchivo}`;

    file.mv(path, (err) => {

        if (err) {
            return res.status(500).send(err);
        }

        return res.json({ ok: true, msg: 'Archivo cargado' });

    });

    // sql.connect(config, (err) => {

    //     if (err) return res.status(401).send(err);

    //     let sttmt = new sql.PreparedStatement();

    //     sttmt.input('folio', sql.VarChar).input('path', sql.VarChar).input('name', sql.VarChar).input('type', sql.VarChar).input('sgi', sql.VarChar).input('original_path', sql.VarChar).input('module', sql.Int)
    //     sttmt.prepare(`INSERT INTO master_files (folio, path, original_name, type, sgi_enter, original_path, module) VALUES (@folio, @path, @name, @type, @sgi, @original_path, @modulo)`, err => {

    //         if (err) return res.status(401).send(err);

    //         sttmt.execute({ folio: folio, path: path, name: nombreOriginal, type: tipoMasterFiles, sgi: sgi, original_path: path, modulo: modulo }, (err, result) => {

    //             if (err) return res.status(401).send(err);

    //             if (result.rowsAffected[0] > 0) {
    //                 return res.status(200).json({ ok: true, message: 'Archivo cargado!' });
    //             } else {
    //                 return res.status(400).json({ ok: false, message: 'Error al cargar archivo' });
    //             }

    //         })

    //     });

    // });

}

module.exports = actividadesCtrl;