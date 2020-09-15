const sql = require("mssql");
const config = require('../database');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

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

    }

    if (role == 'Responsable') {

        await sql.connect(config, function(err) {

            if (err) return res.status(401).send(err);

            let sttmt = new sql.PreparedStatement();
            sttmt.input('role', sql.VarChar).input('status', sql.VarChar).input('sgi', sql.VarChar)
            sttmt.prepare('SELECT dsm.s_folio AS folio, dsm.s_maquina AS maquina, a.a_zona_maquina AS zona_maquina, dsm.s_actividad AS actividad, csm.s_nombre AS nombre, dsm.s_id_sub_maquina AS id_sub_maquina, a.a_prioridad AS prioridad, a.a_tarea AS tarea, dsm.s_tipo_anomalia AS tipo_anomalia, dsm.s_clasificacion_anomalia AS clasificacion_anomalia, dsm.s_comentarios AS descripcion_anomalia FROM progress_mantto p LEFT JOIN d_mantto_sub_maquinas dsm ON p.sub_actividad = dsm.s_id_sub_maquina LEFT JOIN c_mantto_sub_maquinas csm ON dsm.s_id_sub_maquina = csm.id_sub_maquina RIGHT JOIN c_mantto_actividades a ON dsm.s_actividad = a.id_actividad WHERE p.role = @role AND p.status = @status AND dsm.s_usr_now = @sgi', err => {

                if (err) return res.status(401).send(err);

                sttmt.execute({ role: role, status: 'Pendiente', sgi: sgi }, (err, result) => {

                    if (err) return res.status(401).send(err);

                    for (let i = 0; i < result.rowsAffected; i++) {
                        registros.push(result.recordset[i]);
                    }

                    return res.status(200).json({ ok: true, registros: registros });

                });

            });

        });

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
        sttmt.prepare(`SELECT dsm.s_folio AS folio, dsm.s_maquina AS maquina, dsm.s_actividad AS actividad, csm.s_nombre AS nombre, dsm.s_id_sub_maquina AS id_sub_maquina FROM d_mantto_sub_maquinas dsm LEFT JOIN c_mantto_sub_maquinas csm ON dsm.s_id_sub_maquina = csm.id_sub_maquina WHERE dsm.s_folio = @folio AND dsm.s_status = @status`, err => {

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

    const { id_actividad, sgi, folio, role } = req.body;
    const registros = [];

    if (role == 'Operador') {

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

    } else {

        await sql.connect(config, function(err) {

            if (err) return res.status(401).send(err);

            let sttmt = new sql.PreparedStatement();

            sttmt.input('id', sql.Int).input('sgi', sql.VarChar).input('folio', sql.VarChar).input('status', sql.VarChar);
            sttmt.prepare(`SELECT sm.id_sub_maquina, sm.s_folio, m.m_maquina, a.a_prioridad, a.a_zona_maquina, a.a_tarea, a.a_maquina_parada, a.a_categoria, u.Name AS a_resp_tarea, sm.s_comentarios, sm.s_tipo_anomalia, sm.s_clasificacion_anomalia FROM d_mantto_sub_maquinas sm LEFT JOIN c_mantto_actividades a ON sm.s_actividad = a.id_actividad RIGHT JOIN c_mantto_maquinas m ON sm.s_maquina = m.id_maquina LEFT JOIN users u ON a.a_resp_tarea = u.SGI WHERE sm.s_id_sub_maquina = @id and sm.s_usr_now = @sgi AND sm.s_folio = @folio AND sm.s_status = @status`, err => {

                if (err) return res.status(401).send(err);

                sttmt.execute({ id: id_actividad, sgi: sgi, folio: folio, status: 'NOK' }, (err, result) => {

                    if (err) return res.status(401).send(err);

                    for (let i = 0; i < result.rowsAffected; i++) {
                        registros.push(result.recordset[i]);
                    }

                    return res.status(200).json({ ok: true, registros: registros });

                });

            })

        });

    }


}

actividadesCtrl.realizarActividad = async(req, res) => {

    const { id_actividad, folio, opcion, descripcion, rol, sgi } = req.body;

    console.log(id_actividad, folio, opcion, descripcion, rol);

    if (rol == 'Operador') {

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

            }

        });

    }

    // if (rol == 'Operador') {

    //     await sql.connect(config, (err) => {

    //         if (err) return res.status(401).send(err);

    //         let sttmt = new sql.PreparedStatement();

    //         if (opcion == 'OK') {

    //             sttmt.input('id', sql.Int).input('folio', sql.VarChar).input('opcion', sql.VarChar).input('status', sql.VarChar);
    //             sttmt.prepare(`UPDATE d_mantto_sub_maquinas SET s_status = @opcion WHERE s_id_sub_maquina = @id AND s_folio = @folio AND s_status = @status`, err => {

    //                 if (err) return res.status(401).send(err);

    //                 sttmt.execute({ id: id_actividad, folio: folio, opcion: opcion, status: 'Pendiente' }, (err, result) => {

    //                     if (err) return res.status(401).send(err);

    //                     if (result.rowsAffected[0] > 0) {
    //                         return res.status(200).json({ ok: true, message: 'Actividad Realizada Correctamente!' });
    //                     } else {
    //                         return res.status(400).json({ ok: false, message: 'Error al registrar actividad' });
    //                     }

    //                 });

    //             });

    //         } else if (opcion == 'NOK') {

    //             sttmt.input('id', sql.Int).input('folio', sql.VarChar).input('opcion', sql.VarChar).input('status', sql.VarChar).input('descripcion', sql.VarChar).input('anomalia', sql.Int)
    //             sttmt.prepare(`UPDATE d_mantto_sub_maquinas SET s_status = @opcion, s_comentarios = @descripcion, s_anomalia = @anomalia WHERE s_id_sub_maquina = @id AND s_folio = @folio AND s_status = @status`, err => {

    //                 if (err) return res.status(401).send(err);

    //                 sttmt.execute({ id: id_actividad, folio: folio, opcion: opcion, descripcion: descripcion, status: 'Pendiente', anomalia: 1 }, (err, result) => {

    //                     if (err) return res.status(401).send(err);

    //                     if (result.rowsAffected[0] > 0) {

    //                         sql.connect(config, err => {

    //                             if (err) return res.status(401).send(err);

    //                             // Procedimiento Almacenado
    //                             new sql.Request().input('caso', sql.Int, 1).input('folio', sql.VarChar, folio).input('id_sub_maquina', sql.Int, id_actividad).input('rol', sql.VarChar, rol).execute('NotifyMantto', (err, result) => {
    //                                 console.log(result);
    //                                 res.status(200).json({ ok: true, message: 'Anomalia Registrada!' });
    //                             });

    //                         });

    //                     } else {
    //                         res.status(400).json({ ok: false, message: 'Error al registrar anomalia' });
    //                     }

    //                 });

    //             });

    //         }

    //     });

    // }

    if (rol == 'Responsable') {

        sql.connect(config, function(err) {

            if (err) return res.status(401).send(err);

            let sttmt = new sql.PreparedStatement();

            if (opcion == 'OK') {

                sttmt.input('id', sql.Int).input('folio', sql.VarChar).input('opcion', sql.VarChar).input('status', sql.VarChar);
                sttmt.prepare(`UPDATE d_mantto_sub_maquinas SET s_status = @opcion WHERE s_folio = @folio AND id_sub_maquina = @id AND s_status = @status`, err => {

                    if (err) return res.status(401).send(err);

                    sttmt.execute({ opcion: 'OK', folio: folio, id: id_actividad, status: 'NOK' }, (err, result) => {

                        if (err) return res.status(401).send(err);

                        if (result.rowsAffected[0] > 0) {

                            // return res.status(200).json({ ok: true, message: 'La anomalia ha sido corregida!' });

                            sql.connect(config).then(() => {

                                return sql.query `UPDATE progress_mantto SET status = 'Liberado', fecha_movimiento = GETDATE() WHERE folio = ${folio} AND sub_actividad = ${id_actividad} AND role = 'Responsable' AND approval = ${sgi}`

                            }).then(result => {

                                console.log(result);

                                return res.status(200).json({ ok: true, message: 'La anomalia ha sido corregida!' });

                            }).catch(err => {
                                if (err) return res.status(401).json(err);
                            });

                        } else {
                            return res.status(400).json({ ok: false, message: 'Error al corregir la anomalia' });
                        }

                    });

                });

            } else {
                return res.status(400).json({ ok: false, message: `Opcion incorrecta, se recibio: ${opcion}` });
            }

        });

    }

}

actividadesCtrl.postearAnomalia = async(req, res) => {

    const { sgi, role, folio, id_sub_maquina, datos } = req.body;

    // return res.json('Entro :D');

    const pool1 = new sql.ConnectionPool(config);
    const pool1Connect = pool1.connect();

    pool1.on('error', err => {
        return res.status(401).json(err);
    });

    const pool2 = new sql.ConnectionPool(config)
    const pool2Connect = pool2.connect();

    pool2.on('error', err => {
        return res.status(401).json(err);
    });

    async function registrarAnomalia() {

        // const registros = [];
        await pool1Connect;

        try {

            const request = pool1.request();

            if (datos.anomalia === 'Otro') {

                const result1 = await request.query(`UPDATE d_mantto_sub_maquinas SET s_status = 'NOK', s_comentarios = '${datos.descripcion}', s_tipo_anomalia = '${datos.anomalia}, ${datos.anomaliaEspecifica}', s_clasificacion_anomalia = '${datos.clasificacion}', s_anomalia = 1 WHERE s_id_sub_maquina = ${id_sub_maquina} AND s_folio = '${folio}' AND s_status = 'Pendiente'`);
                // console.log(result1);

            } else {

                const result1 = await request.query(`UPDATE d_mantto_sub_maquinas SET s_status = 'NOK', s_comentarios = '${datos.descripcion}', s_tipo_anomalia = '${datos.anomalia}', s_clasificacion_anomalia = '${datos.clasificacion}', s_anomalia = 1 WHERE s_id_sub_maquina = ${id_sub_maquina} AND s_folio = '${folio}' AND s_status = 'Pendiente'`);
                // console.log(result1);

            }

            datos.categorias.forEach(async anomalia => {

                const result2 = await request.query(`INSERT INTO d_mantto_anm_categorias (anm_folio, anm_sub_maquina, anm_categoria) VALUES ('${folio}', ${id_sub_maquina}, '${anomalia}')`);
                // console.log(result2);

            });

            return true;

        } catch (error) {
            console.log('SQL error', error);
        }
    }

    function administrarFlujo() {

        return pool2Connect.then((pool) => {
            pool.request() // or: new sql.Request(pool2)
                .input('caso', sql.Int, 1)
                .input('folio', sql.VarChar, folio)
                .input('id_sub_maquina', sql.Int, id_sub_maquina)
                .input('rol', sql.VarChar, role)
                .execute('NotifyMantto', (err, result) => {
                    // ... error checks
                    if (err) {
                        console.log(err);
                        return false;
                    }
                    console.log(result);
                    return res.status(200).json({ ok: true, message: 'Anomalia Registrada Correctamente', folio: folio });
                })
        }).catch(err => {
            console.log(err);
            return false;
        });

    }

    const anomalia = registrarAnomalia();

    if (anomalia) {
        administrarFlujo();
    } else {
        return res.status(400).json({ mensaje: 'Error en el servidor' });
    }


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

    const { tipo, folio, sgi, id_sub_maquina } = req.body;

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

    // const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;
    const nombreArchivo = `${ folio }-${ id_sub_maquina }-${ uuidv4() }.${ extensionArchivo }`;
    const path = `server/uploads/${tipo}/${nombreArchivo}`;
    const pathMasterFiles = `uploads/${tipo}/${nombreArchivo}`;

    file.mv(path, (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        // return res.json({ ok: true, msg: 'Archivo cargado' });

        // TODO: Ajustar el metodo para guardar archivos
        // async/await style:
        const pool1 = new sql.ConnectionPool(config);
        const pool1Connect = pool1.connect();

        pool1.on('error', err => {
            return res.status(400).json(err);
        })

        async function administrarArchivos() {

            await pool1Connect; // ensures that the pool has been created
            try {

                const request = pool1.request(); // or: new sql.Request(pool1)
                const result = await request.query(`INSERT INTO master_files (folio, path, original_name, type, sgi_enter, original_path, module) VALUES ('${folio}', '${pathMasterFiles}', '${nombreOriginal}', '${tipoMasterFiles}', '${sgi}', '${pathMasterFiles}', ${modulo}) SELECT SCOPE_IDENTITY() as id`)
                const id = result.recordset[0].id;

                const request2 = pool1.request(); // or: new sql.Request(pool1)
                const result2 = await request2.query(`INSERT INTO d_mantto_evidencias (e_folio, e_sub_maquina, e_archivo, e_tipo) VALUES ('${folio}', '${ id_sub_maquina }', ${id}, '${tipo}')`)

                return res.json({ ok: true, msg: 'Archivo cargado' });

            } catch (err) {
                console.error('SQL error', err);
            }

        }

        administrarArchivos();

        // Esto funciona y devuelve el ultimo id insertado
        // sql.connect(config).then(() => {

        //     return sql.query `INSERT INTO master_files (folio, path, original_name, type, sgi_enter, original_path, module) VALUES (${folio}, ${path}, ${nombreOriginal}, ${tipoMasterFiles}, ${sgi}, ${path}, ${modulo}) SELECT SCOPE_IDENTITY() as id`

        // }).then(result => {

        //     console.log(result);

        //     return res.status(200).json({ ok: true, message: 'Archivo cargado!' });

        // }).catch(err => {
        //     if (err) return res.status(401).json(err);
        // });

    });


}

actividadesCtrl.coordinarAnomalia = async(req, res) => {

    const { general } = req.body;
    const { datos } = req.body;

    if (general.role == 'Interceptor') {

        await sql.connect(config, function(err) {

            if (err) return res.status(401).send(err);

            let sttmt = new sql.PreparedStatement();
            sttmt.input('categoria', sql.VarChar).input('clasificacion', sql.VarChar).input('folio', sql.VarChar).input('maquina', sql.Int).input('sub_maquina', sql.Int).input('status', sql.VarChar).input('responsable', sql.VarChar)
            sttmt.prepare('UPDATE d_mantto_sub_maquinas SET s_tipo_anomalia = @categoria, s_clasificacion_anomalia = @clasificacion, s_usr_now = @responsable WHERE s_folio = @folio AND s_maquina = @maquina AND s_id_sub_maquina = @sub_maquina AND s_status = @status', err => {

                if (err) return res.status(401).send(err);

                sttmt.execute({ categoria: datos.categoria, clasificacion: datos.clasificacion, responsable: datos.responsable, folio: general.folio, maquina: general.id_maquina, sub_maquina: general.id_sub_maquina, status: 'NOK' }, (err, result) => {

                    if (err) return res.status(401).send(err);

                    if (result.rowsAffected[0] > 0) {

                        datos.anomalias.forEach(anomalia => {

                            sql.connect(config).then(() => {

                                return sql.query `INSERT INTO d_mantto_anomalias_checks (anm_folio, anm_maquina, anm_sub_maquina, anm_nombre) VALUES (${general.folio}, ${general.id_maquina}, ${general.id_sub_maquina}, ${anomalia.name})`

                            }).then(result => {

                                console.log(result);

                            }).catch(err => {
                                if (err) return res.status(401).json(err);
                            });

                        });

                        sql.connect(config).then(() => {

                            return sql.query `UPDATE progress_mantto SET approval = ${general.sgi}, status = 'Aprobado', fecha_movimiento = GETDATE() WHERE folio = ${general.folio} AND role = ${general.role} AND sub_actividad = ${general.id_sub_maquina} AND status = 'Pendiente'`

                        }).then(result => {

                            console.log(result);

                            // Procedimiento Almacenado
                            new sql.Request().input('caso', sql.Int, 1).input('folio', sql.VarChar, general.folio).input('id_sub_maquina', sql.Int, general.id_sub_maquina).input('rol', sql.VarChar, general.role).execute('NotifyMantto', (err, result) => {

                                if (err) return res.status(401).send(err);

                                console.log(result);
                                res.status(200).json({ ok: true, message: 'La anomalia fue coordinada!' });

                            });

                        }).catch(err => {
                            if (err) return res.status(401).json(err);
                        });


                    } else {
                        return res.status(400).json({ ok: false, message: 'Error al coordinar la anomalia' });
                    }

                });

            });

        });

    }

}

actividadesCtrl.agregarAcciones = async(req, res) => {

    const { general } = req.body;
    const { acciones } = req.body;

    console.log(general);

    await sql.connect(config, (err) => {

        if (err) return res.status(401).send(err);

        let sttmt = new sql.PreparedStatement();

        sttmt.input('id_sub_maquina', sql.VarChar);
        sttmt.prepare('SELECT s_actividad FROM c_mantto_sub_maquinas WHERE id_sub_maquina = @id_sub_maquina', err => {

            if (err) return res.status(401).send(err);

            sttmt.execute({ id_sub_maquina: general.id_sub_maquina }, (err, result) => {

                if (err) return res.status(401).send(err);

                let actividad = result.recordset[0];

                acciones.features.forEach(accion => {

                    console.log(accion);

                    sql.connect(config).then(() => {

                        return sql.query `INSERT INTO d_mantto_anomalias_comments (ac_folio, ac_actividad, ac_sub_maquina, ac_comment, ac_responsable) VALUES (${general.folio}, ${actividad.s_actividad}, ${general.id_sub_maquina}, ${accion}, ${general.sgi})`
                            // return sql.query `INSERT INTO d_mantto_anomalias_checks (anm_folio, anm_maquina, anm_sub_maquina, anm_nombre) VALUES (${general.folio}, ${general.id_maquina}, ${general.id_sub_maquina}, ${anomalia.name})`

                    }).then(result => {

                        console.log(result);

                    }).catch(err => {
                        if (err) return res.status(401).json(err);
                    });

                });

                return res.status(200).json({ ok: true, message: 'Acciones Registradas Correctamente' });

            });

        });

    });

    // await sql.connect(config, (err) => {

    //     if (err) return res.status(401).send(err);

    //     let sttmt = new sql.PreparedStatement();
    //     sttmt.input('id_sub_actividad', sql.VarChar);
    //     sttmt.prepare('SELECT s_actividad FROM c_mantto_sub_maquinas WHERE id_sub_maquina = @id_sub_maquina', err => {

    //         if (err) return res.status(401).send(err);

    //         sttmt.execute({ id_sub_maquina: general.id_sub_maquina }, (err, result) => {

    //             if (err) return resp.status(401).send(err);

    //             if (result.rowsAffected[0] > 0) {
    //                 console.log(result);
    //             }

    //         })

    //     });

    // })

    // datos.anomalias.forEach(anomalia => {

    //     sql.connect(config).then(() => {

    //         return sql.query `INSERT INTO d_mantto_anomalias_checks (anm_folio, anm_maquina, anm_sub_maquina, anm_nombre) VALUES (${general.folio}, ${general.id_maquina}, ${general.id_sub_maquina}, ${anomalia.name})`

    //     }).then(result => {

    //         console.log(result);

    //     }).catch(err => {
    //         if (err) return res.status(401).json(err);
    //     });

    // });

}

actividadesCtrl.historico = (req, res) => {

    const { sgi, role } = req.body;

    if (role == 'Operador') {

        const pool1 = new sql.ConnectionPool(config);
        const pool1Connect = pool1.connect();

        pool1.on('error', err => {
            return res.status(401).send(err);
        });

        async function messageHandler() {

            const registros = [];
            await pool1Connect;

            try {

                const request = pool1.request();

                const result1 = await request.query(`SELECT COUNT(*) AS OK FROM d_mantto_sub_maquinas WHERE s_operador = '${sgi}' AND s_status = 'OK'`);
                console.log(result1);
                registros.push(result1.recordset[0]);

                const result2 = await request.query(`SELECT COUNT(*) AS NOK FROM d_mantto_sub_maquinas WHERE s_operador = '${sgi}' AND s_status = 'NOK'`);
                console.log(result2);
                registros.push(result2.recordset[0]);

                const result3 = await request.query(`SELECT COUNT(*) AS Pendiente FROM d_mantto_sub_maquinas WHERE s_operador = '${sgi}' AND s_status = 'Pendiente'`);
                console.log(result3);
                registros.push(result3.recordset[0]);

                console.log(registros);

                return registros;

            } catch (error) {
                console.log('SQL error', error);
            }
        }

        const registros = messageHandler();

        registros.then(registro => {
            // console.log(registro);
            return res.status(200).json({ ok: true, registros: registro });
        });

        // return res.status(200).json({ ok: true, registros: registros });

    }

}

actividadesCtrl.verAcciones = async(req, res) => {

    const { sgi, role } = req.body;
    const registros = [];

    if (role == 'Responsable') {

        await sql.connect(config, (err) => {

            if (err) return res.status(401).send(err);

            let sttmt = new sql.PreparedStatement();

            sttmt.input('sgi', sql.VarChar);
            sttmt.prepare('SELECT ac.ac_folio AS folio, a.a_prioridad AS prioridad, sm.s_nombre AS sub_maquina, ac.ac_comment AS accion FROM d_mantto_anomalias_comments ac INNER JOIN c_mantto_actividades a ON ac.ac_actividad = a.id_actividad INNER JOIN c_mantto_sub_maquinas sm ON ac.ac_sub_maquina = sm.id_sub_maquina WHERE ac.ac_responsable = @sgi', err => {

                if (err) return res.status(401).send(err);

                sttmt.execute({ sgi: sgi }, (err, result) => {

                    if (err) return res.status(401).send(err);

                    for (let i = 0; i < result.rowsAffected; i++) {
                        const registro = result.recordset[i];
                        registros.push(registro);
                    }

                    return res.status(200).json({ ok: true, registros: registros });

                });

            });

        });

    } else {

        // SELECT ac.ac_folio AS folio, a.a_prioridad AS prioridad, sm.s_nombre AS sub_maquina, ac.ac_comment AS accion FROM d_mantto_anomalias_comments ac INNER JOIN d_mantto_general g ON ac.ac_folio = g.g_folio INNER JOIN c_mantto_actividades a ON ac.ac_actividad = a.id_actividad INNER JOIN c_mantto_sub_maquinas sm ON ac.ac_sub_maquina = sm.id_sub_maquina WHERE g.g_operador = 'J0580041'
        await sql.connect(config, (err) => {

            if (err) return res.status(401).send(err);

            let sttmt = new sql.PreparedStatement();

            sttmt.input('sgi', sql.VarChar);
            sttmt.prepare('SELECT ac.ac_folio AS folio, a.a_prioridad AS prioridad, sm.s_nombre AS sub_maquina, ac.ac_comment AS accion FROM d_mantto_anomalias_comments ac INNER JOIN d_mantto_general g ON ac.ac_folio = g.g_folio INNER JOIN c_mantto_actividades a ON ac.ac_actividad = a.id_actividad INNER JOIN c_mantto_sub_maquinas sm ON ac.ac_sub_maquina = sm.id_sub_maquina WHERE g.g_operador = @sgi', err => {

                if (err) return res.status(401).send(err);

                sttmt.execute({ sgi: sgi }, (err, result) => {

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

}

actividadesCtrl.obtenerImagen = (req, res) => {

    const { tipo, imagen } = req.params;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${imagen}`);
    res.sendFile(pathImg);

}

module.exports = actividadesCtrl;