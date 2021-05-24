const sql = require("mssql");
const config = require('../database');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const actividadesCtrl = {};

actividadesCtrl.obtenerPendientes = async(req, res) => {

    const { sgi, role } = req.body;
    // let registros = [];

    if (role == "Operador") {

        const pool1 = new sql.ConnectionPool(config);
        const pool1Connect = pool1.connect();

        pool1.on('error', err => {
            return res.status(401).send(err);
        });

        async function handlerPendientes() {

            const registros = [];
            await pool1Connect;

            try {

                const request = pool1.request();

                // const result = await request.query(`SELECT g.g_folio, m.id_maquina, m.m_maquina, a.id_actividad, a.a_prioridad, a.a_zona_maquina, a.a_tarea, a.a_maquina_parada, g.g_operador, g.g_total_pendientes FROM d_mantto_general g LEFT JOIN c_mantto_actividades a ON g.g_actividad = a.id_actividad RIGHT JOIN c_mantto_maquinas m ON g.g_maquina = m.id_maquina WHERE g.g_operador = '${sgi}' AND g.g_status_now = 'Pendiente'`);
                const result = await request.query(`SELECT g.g_folio, m.id_maquina, m.m_maquina, a.id_actividad, a.a_prioridad, a.a_zona_maquina, a.a_tarea, a.a_maquina_parada, g.g_operador, g.g_total_pendientes, ISNULL(f.path, 'Files/no-img//no-img.jpg') AS path FROM d_mantto_general g LEFT JOIN c_mantto_actividades a ON g.g_actividad = a.id_actividad RIGHT JOIN c_mantto_maquinas m ON g.g_maquina = m.id_maquina LEFT JOIN d_mantto_imagenes img ON a.id_actividad = img.img_actividad LEFT JOIN master_files f ON img.img_file = f.id_file WHERE g.g_operador = '${sgi}' AND g.g_status_now = 'Pendiente'`);
                // const registros = result1.recordset;

                for (let i = 0; i < result.rowsAffected; i++) {
                    registros.push(result.recordset[i]);
                }

                return registros;

            } catch (error) {
                console.log('SQL error', error);
            }

        }

        const registros = await handlerPendientes();
        return res.status(200).json({ ok: true, registros: registros });

    }

    if (role == 'Responsable') {

        const pool1 = new sql.ConnectionPool(config);
        const pool1Connect = pool1.connect();

        pool1.on('error', err => {
            return res.status(401).send(err);
        });

        async function handlerPendientes() {

            const registros = [];
            await pool1Connect;

            try {

                const request = pool1.request();

                // const result = await request.query(`SELECT dsm.s_folio AS folio, dsm.s_maquina AS maquina, a.a_zona_maquina AS zona_maquina, dsm.s_actividad AS actividad, csm.s_nombre AS nombre, dsm.s_id_sub_maquina AS id_sub_maquina, a.a_prioridad AS prioridad, a.a_tarea AS tarea, dsm.s_tipo_anomalia AS tipo_anomalia, dsm.s_clasificacion_anomalia AS clasificacion_anomalia, dsm.s_comentarios AS descripcion_anomalia FROM progress_mantto p LEFT JOIN d_mantto_sub_maquinas dsm ON p.sub_actividad = dsm.s_id_sub_maquina LEFT JOIN c_mantto_sub_maquinas csm ON dsm.s_id_sub_maquina = csm.id_sub_maquina RIGHT JOIN c_mantto_actividades a ON dsm.s_actividad = a.id_actividad WHERE p.role = '${role}' AND p.status = 'Pendiente' AND dsm.s_usr_now = '${sgi}'`);
                const result = await request.query(`SELECT distinct dsm.s_folio AS folio, dsm.s_maquina AS maquina, a.a_zona_maquina AS zona_maquina, dsm.s_actividad AS actividad, csm.s_nombre AS nombre, dsm.s_id_sub_maquina AS id_sub_maquina, a.a_prioridad AS prioridad, a.a_tarea AS tarea, dsm.s_tipo_anomalia AS tipo_anomalia, dsm.s_clasificacion_anomalia AS clasificacion_anomalia, dsm.s_comentarios AS descripcion_anomalia FROM progress_mantto p INNER JOIN d_mantto_sub_maquinas dsm ON p.sub_actividad = dsm.s_id_sub_maquina INNER JOIN c_mantto_sub_maquinas csm ON dsm.s_id_sub_maquina = csm.id_sub_maquina INNER JOIN c_mantto_actividades a ON dsm.s_actividad = a.id_actividad WHERE p.role = '${role}' AND p.status = 'Pendiente' AND dsm.s_usr_now = '${sgi}' AND dsm.s_status = 'NOK'`);
                // const registros = result1.recordset;

                for (let i = 0; i < result.rowsAffected; i++) {
                    registros.push(result.recordset[i]);
                }

                return registros;

            } catch (error) {
                console.log('SQL error', error);
            }

        }

        const registros = await handlerPendientes();
        return res.status(200).json({ ok: true, registros: registros });

    }

};

actividadesCtrl.obtenerActividades = async(req, res) => {

    const { folio } = req.body;
    // let registros = [];

    const pool1 = new sql.ConnectionPool(config);
    const pool1Connect = pool1.connect();

    pool1.on('error', err => {
        return res.status(401).send(err);
    });

    async function handlerActividades() {

        const registros = [];
        await pool1Connect;

        try {

            const request = pool1.request();

            const result = await request.query(`SELECT dsm.s_folio AS folio, dsm.s_maquina AS maquina, dsm.s_actividad AS actividad, csm.s_nombre AS nombre, dsm.s_id_sub_maquina AS id_sub_maquina FROM d_mantto_sub_maquinas dsm LEFT JOIN c_mantto_sub_maquinas csm ON dsm.s_id_sub_maquina = csm.id_sub_maquina WHERE dsm.s_folio = '${folio}' AND dsm.s_status = 'Pendiente'`);
            // const registros = result1.recordset;

            for (let i = 0; i < result.rowsAffected; i++) {
                registros.push(result.recordset[i]);
            }

            return registros;

        } catch (error) {
            console.log('SQL error', error);
        }

    }

    const registros = await handlerActividades();
    return res.status(200).json({ ok: true, registros: registros });

}

actividadesCtrl.obtenerActividad = async(req, res) => {

    const { id_actividad, sgi, folio, role } = req.body;
    // const registros = [];

    if (role == 'Operador') {

        const pool1 = new sql.ConnectionPool(config);
        const pool1Connect = pool1.connect();

        pool1.on('error', err => {
            return res.status(401).send(err);
        });

        async function handlerActividad() {

            const registros = [];
            await pool1Connect;

            try {

                const request = pool1.request();

                const result = await request.query(`SELECT sm.id_sub_maquina, sm.s_folio, m.m_maquina, a.a_prioridad, a.a_zona_maquina, a.a_tarea, a.a_maquina_parada, a.a_categoria, u.Name AS a_resp_tarea FROM d_mantto_sub_maquinas sm LEFT JOIN c_mantto_actividades a ON sm.s_actividad = a.id_actividad RIGHT JOIN c_mantto_maquinas m ON sm.s_maquina = m.id_maquina LEFT JOIN users u ON a.a_jefe_tarea = u.SGI WHERE sm.s_id_sub_maquina = ${id_actividad} and sm.s_operador = '${sgi}' AND sm.s_folio = '${folio}' AND sm.s_status = 'Pendiente'`);
                // const registros = result1.recordset;

                for (let i = 0; i < result.rowsAffected; i++) {
                    registros.push(result.recordset[i]);
                }

                const result2 = await request.query(`UPDATE d_mantto_sub_maquinas SET s_tiempo_escaneo = GETDATE() WHERE s_folio = '${folio}' AND s_id_sub_maquina = ${id_actividad} AND s_status = 'Pendiente'`);
                // console.log(result2);

                return registros;

            } catch (error) {
                console.log('SQL error', error);
            }

        }

        const registros = await handlerActividad();
        return res.status(200).json({ ok: true, registros: registros });

    } else {

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

                const result1 = await request.query(`SELECT sm.id_sub_maquina, sm.s_folio, m.m_maquina, a.a_prioridad, a.a_zona_maquina, a.a_tarea, a.a_maquina_parada, a.a_categoria, u.Name AS a_resp_tarea, sm.s_comentarios, sm.s_tipo_anomalia, sm.s_clasificacion_anomalia FROM d_mantto_sub_maquinas sm LEFT JOIN c_mantto_actividades a ON sm.s_actividad = a.id_actividad RIGHT JOIN c_mantto_maquinas m ON sm.s_maquina = m.id_maquina LEFT JOIN users u ON a.a_resp_tarea = u.SGI WHERE sm.s_id_sub_maquina = ${id_actividad} and sm.s_usr_now = '${sgi}' AND sm.s_folio = '${folio}' AND sm.s_status = 'NOK'`);
                console.log(result1);
                const registros = result1.recordset;
                // registros.push(result1.recordset[0]);

                const result2 = await request.query(`SELECT anm_categoria AS categoria_anomalia FROM d_mantto_anm_categorias WHERE anm_folio = '${folio}' AND anm_sub_maquina = ${id_actividad}`);
                const categorias = result2.recordset;

                const result3 = await request.query(`SELECT path FROM d_mantto_evidencias e INNER JOIN master_files f ON e.e_archivo = f.id_file WHERE folio = '${folio}' AND e_sub_maquina = ${id_actividad}`);
                const images = result3.recordset;

                const data = { registros, categorias, images };

                return data;

            } catch (error) {
                console.log('SQL error', error);
            }

        }

        const registros = await detalleOk();
        return res.status(200).json({ ok: true, registros: registros.registros, categorias: registros.categorias, images: registros.images });

    }

}

actividadesCtrl.realizarActividad = async(req, res) => {

    const { id_actividad, folio, opcion, descripcion, rol, sgi } = req.body;

    console.log(id_actividad, folio, opcion, descripcion, rol, sgi);

    if (rol == 'Operador') {

        const pool1 = new sql.ConnectionPool(config);
        const pool1Connect = pool1.connect();

        pool1.on('error', err => {
            return res.status(401).send(err);
        });

        async function handlerActividad() {

            // const registros = [];
            await pool1Connect;

            try {

                const request = pool1.request();

                if (opcion == 'OK') {

                    const result = await request.query(`UPDATE d_mantto_sub_maquinas SET s_status = '${opcion}', s_tiempo_ejecutado = GETDATE() WHERE s_id_sub_maquina = ${id_actividad} AND s_folio = '${folio}' AND s_status = 'Pendiente'`);
                    console.log(result);

                    if (result.rowsAffected[0] > 0) {
                        return true
                    } else {
                        return false;
                    }

                }

            } catch (error) {
                console.log('SQL error', error);
            }

        }

        const registros = await handlerActividad();

        if (registros) {
            return res.status(200).json({ ok: true, message: 'Actividad Realizada Correctamente!' });
        } else {
            return res.status(400).json({ ok: false, message: 'Error al registrar actividad' });
        }

    }

    if (rol == 'Responsable') {

        const pool1 = new sql.ConnectionPool(config);
        const pool1Connect = pool1.connect();

        pool1.on('error', err => {
            return res.status(401).send(err);
        });

        async function corregirAnomalia() {

            // const registros = [];
            await pool1Connect;

            try {

                const request = pool1.request();

                const result1 = await request.query(`UPDATE d_mantto_sub_maquinas SET s_status = 'OK' WHERE s_folio = '${folio}' AND id_sub_maquina = ${id_actividad} AND s_status = 'NOK'`);
                console.log(result1);

                const result2 = await request.query(`UPDATE progress_mantto SET status = 'Liberado', fecha_movimiento = GETDATE() WHERE folio = '${folio}' AND sub_actividad = ${id_actividad} AND role = 'Responsable' AND approval = '${sgi}'`);
                console.log(result2);

                const result = await request.query(`SELECT p.approval, p.folio, p.role, sm.s_nombre AS sub_maquina FROM progress_mantto p INNER JOIN c_mantto_sub_maquinas sm ON p.sub_actividad = sm.id_sub_maquina WHERE folio = '${folio}' AND role = 'Operador' AND sub_actividad = ${id_actividad}`);
                const data = result.recordset[0];

                return data;

                // return true;

            } catch (error) {
                console.log('SQL error', error);
            }

        }

        const resuelta = await corregirAnomalia();

        if (resuelta) {
            return res.status(200).json({ ok: true, message: 'La anomalia ha sido corregida!', data: resuelta });
        } else {
            return res.status(400).json({ ok: false, message: 'Error al corregir la anomalia' });
        }

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

        const registros = [];
        await pool1Connect;

        try {

            const request = pool1.request();

            if (datos.anomalia === 'Otro') {

                const result1 = await request.query(`UPDATE d_mantto_sub_maquinas SET s_status = 'NOK', s_comentarios = '${datos.descripcion}', s_tipo_anomalia = '${datos.anomalia}, ${datos.anomaliaEspecifica}', s_clasificacion_anomalia = '${datos.clasificacion}', s_anomalia = 1, s_tiempo_ejecutado = GETDATE() WHERE s_id_sub_maquina = ${id_sub_maquina} AND s_folio = '${folio}' AND s_status = 'Pendiente'`);
                // console.log(result1);

            } else {

                const result1 = await request.query(`UPDATE d_mantto_sub_maquinas SET s_status = 'NOK', s_comentarios = '${datos.descripcion}', s_tipo_anomalia = '${datos.anomalia}', s_clasificacion_anomalia = '${datos.clasificacion}', s_anomalia = 1, s_tiempo_ejecutado = GETDATE() WHERE s_id_sub_maquina = ${id_sub_maquina} AND s_folio = '${folio}' AND s_status = 'Pendiente'`);
                // console.log(result1);

            }

            datos.categorias.forEach(async anomalia => {

                const result2 = await request.query(`INSERT INTO d_mantto_anm_categorias (anm_folio, anm_sub_maquina, anm_categoria) VALUES ('${folio}', ${id_sub_maquina}, '${anomalia}')`);
                console.log(result2);

            });

            const result = await request.query(`SELECT dsm.s_folio AS folio, a.a_prioridad AS prioridad, m.m_maquina AS nombre_maquina, a.a_jefe_tarea AS responsable, u.user_role AS role, u.user_payload AS payload FROM d_mantto_sub_maquinas dsm INNER JOIN c_mantto_actividades a ON dsm.s_actividad = a.id_actividad INNER JOIN c_mantto_maquinas m ON a.a_maquina = m.id_maquina INNER JOIN d_mantto_users u ON a.a_jefe_tarea = u.user_sgi WHERE dsm.s_folio = '${folio}' AND dsm.s_id_sub_maquina = ${id_sub_maquina}`)
            for (let i = 0; i < result.rowsAffected; i++) {
                registros.push(result.recordset[i]);
            }

            return registros;
            // return true;


        } catch (error) {
            console.log('SQL error', error);
        }
    }

    function administrarFlujo(datos) {

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
                    return res.status(200).json({ ok: true, message: 'Anomalia Registrada Correctamente', folio: folio, datos: datos[0] });
                })
        }).catch(err => {
            console.log(err);
            return false;
        });

    }

    const anomalia = await registrarAnomalia();
    console.log(anomalia);

    if (anomalia) {
        administrarFlujo(anomalia);
    } else {
        return res.status(400).json({ mensaje: 'Error en el servidor' });
    }


}

actividadesCtrl.obtenerRealizadas = async(req, res) => {

    const { status, sgi, role } = req.body;
    // const registros = [];

    if (role == 'Operador') {

        const pool1 = new sql.ConnectionPool(config);
        const pool1Connect = pool1.connect();

        pool1.on('error', err => {
            return res.status(401).send(err);
        });

        async function handlerRealizadas() {

            const registros = [];
            await pool1Connect;

            try {

                const request = pool1.request();

                const result = await request.query(`SELECT dsm.s_folio AS folio, dsm.s_maquina AS maquina, dsm.s_actividad AS actividad, csm.s_nombre AS nombre, dsm.s_id_sub_maquina AS id_sub_maquina, a.a_prioridad AS prioridad, a.a_tarea AS tarea FROM d_mantto_sub_maquinas dsm LEFT JOIN c_mantto_sub_maquinas csm ON dsm.s_id_sub_maquina = csm.id_sub_maquina RIGHT JOIN c_mantto_actividades a ON dsm.s_actividad = a.id_actividad WHERE dsm.s_status = '${status}' AND dsm.s_operador = '${sgi}'`);
                // const registros = result1.recordset;

                for (let i = 0; i < result.rowsAffected; i++) {
                    registros.push(result.recordset[i]);
                }

                return registros;

            } catch (error) {
                console.log('SQL error', error);
            }

        }

        const registros = await handlerRealizadas();
        return res.status(200).json({ ok: true, registros: registros });

    }

    if (role == 'Responsable') {

        const pool1 = new sql.ConnectionPool(config);
        const pool1Connect = pool1.connect();

        pool1.on('error', err => {
            return res.status(401).send(err);
        });

        async function handlerRealizadas() {

            const registros = [];
            await pool1Connect;

            try {

                const request = pool1.request();

                const result = await request.query(`SELECT dsm.s_folio AS folio, dsm.s_maquina AS maquina, dsm.s_actividad AS actividad, csm.s_nombre AS nombre, dsm.s_id_sub_maquina AS id_sub_maquina, a.a_prioridad AS prioridad, a.a_tarea AS tarea FROM d_mantto_sub_maquinas dsm LEFT JOIN c_mantto_sub_maquinas csm ON dsm.s_id_sub_maquina = csm.id_sub_maquina RIGHT JOIN c_mantto_actividades a ON dsm.s_actividad = a.id_actividad WHERE dsm.s_status = '${status}' AND dsm.s_usr_now = '${sgi}'`);
                // const registros = result1.recordset;

                for (let i = 0; i < result.rowsAffected; i++) {
                    registros.push(result.recordset[i]);
                }

                return registros;

            } catch (error) {
                console.log('SQL error', error);
            }

        }

        const registros = await handlerRealizadas();
        return res.status(200).json({ ok: true, registros: registros });

    }


}

actividadesCtrl.obtenerAnomalias = async(req, res) => {

    const { status, sgi } = req.body;
    // const registros = [];

    const pool1 = new sql.ConnectionPool(config);
    const pool1Connect = pool1.connect();

    pool1.on('error', err => {
        return res.status(401).send(err);
    });

    async function handlerAnomalias() {

        const registros = [];
        await pool1Connect;

        try {

            const request = pool1.request();

            const result = await request.query(`SELECT dsm.s_folio AS folio, dsm.s_maquina AS maquina, a.a_zona_maquina AS zona_maquina, dsm.s_actividad AS actividad, csm.s_nombre AS nombre, dsm.s_id_sub_maquina AS id_sub_maquina, a.a_prioridad AS prioridad, a.a_tarea AS tarea, dsm.s_tipo_anomalia AS tipo_anomalia, dsm.s_clasificacion_anomalia AS clasificacion_anomalia, dsm.s_comentarios AS descripcion_anomalia FROM d_mantto_sub_maquinas dsm LEFT JOIN c_mantto_sub_maquinas csm ON dsm.s_id_sub_maquina = csm.id_sub_maquina RIGHT JOIN c_mantto_actividades a ON dsm.s_actividad = a.id_actividad WHERE dsm.s_status = '${status}' AND dsm.s_operador = '${sgi}'`);
            // const registros = result1.recordset;

            for (let i = 0; i < result.rowsAffected; i++) {
                registros.push(result.recordset[i]);
            }

            return registros;

        } catch (error) {
            console.log('SQL error', error);
        }

    }

    const registros = await handlerAnomalias();
    return res.status(200).json({ ok: true, registros: registros });

}

actividadesCtrl.cargarFoto = async(req, res) => {

    const { tipo, folio, sgi, id_sub_maquina } = req.body;
    console.log({ tipo, folio, sgi, id_sub_maquina });

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
    // const pathUpload = `server/uploads/${tipo}/${nombreArchivo}`;
    const pathUpload = path.join(__dirname, `../uploads/${tipo}/${nombreArchivo}`);
    const pathMasterFiles = `uploads/${tipo}/${nombreArchivo}`;

    console.log(pathUpload);

    file.mv(pathUpload, (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        // return res.json({ ok: true, msg: 'Archivo cargado' });

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

    });


}

actividadesCtrl.agregarAcciones = async(req, res) => {

    const { general } = req.body;
    const { acciones } = req.body;

    console.log(general);

    const pool1 = new sql.ConnectionPool(config);
    const pool1Connect = pool1.connect();

    pool1.on('error', err => {
        return res.status(401).send(err);
    });

    async function handlerAcciones() {

        // const registros = [];
        await pool1Connect;

        try {

            const request = pool1.request();

            const result1 = await request.query(`SELECT s_actividad FROM c_mantto_sub_maquinas WHERE id_sub_maquina = ${general.id_sub_maquina}`);
            const actividad = result1.recordset[0];
            console.log(actividad);

            console.log(acciones);

            acciones.features.forEach(async accion => {
                const result2 = await request.query(`INSERT INTO d_mantto_anomalias_comments (ac_folio, ac_actividad, ac_sub_maquina, ac_comment, ac_responsable) VALUES ('${general.folio}', '${actividad.s_actividad}', '${general.id_sub_maquina}', '${accion}', '${general.sgi}')`);
                console.log(result2);
            });

            const result = await request.query(`SELECT p.approval, p.folio, p.role, sm.s_nombre AS sub_maquina FROM progress_mantto p INNER JOIN c_mantto_sub_maquinas sm ON p.sub_actividad = sm.id_sub_maquina WHERE folio = '${general.folio}' AND role = 'Operador' AND sub_actividad = ${general.id_sub_maquina}`);
            const data = result.recordset[0];

            return data;

        } catch (error) {
            console.log('SQL error', error);
        }

    }

    const registros = await handlerAcciones();

    if (registros) {
        return res.status(200).json({ ok: true, message: 'Acciones Registradas Correctamente', data: registros });
    } else {
        return res.status(400).json({ ok: false, message: 'Error al registrar las acciones' });
    }

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

    if (role == 'Responsable') {

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

                const result1 = await request.query(`SELECT COUNT(*) AS OK FROM d_mantto_sub_maquinas WHERE s_usr_now = '${sgi}' AND s_status = 'OK'`);
                console.log(result1);
                registros.push(result1.recordset[0]);

                const result2 = await request.query(`SELECT COUNT(*) AS Pendiente FROM d_mantto_sub_maquinas WHERE s_usr_now = '${sgi}' AND s_status = 'NOK'`);
                console.log(result2);
                registros.push(result2.recordset[0]);

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

    }

}

actividadesCtrl.verAcciones = async(req, res) => {

    const { sgi, role } = req.body;
    // const registros = [];

    if (role == 'Responsable') {

        const pool1 = new sql.ConnectionPool(config);
        const pool1Connect = pool1.connect();

        pool1.on('error', err => {
            return res.status(401).send(err);
        });

        async function handlerVerAcciones() {

            const registros = [];
            await pool1Connect;

            try {

                const request = pool1.request();

                const result = await request.query(`SELECT ac.ac_folio AS folio, a.a_prioridad AS prioridad, sm.s_nombre AS sub_maquina, ac.ac_comment AS accion FROM d_mantto_anomalias_comments ac INNER JOIN c_mantto_actividades a ON ac.ac_actividad = a.id_actividad INNER JOIN c_mantto_sub_maquinas sm ON ac.ac_sub_maquina = sm.id_sub_maquina WHERE ac.ac_responsable = '${sgi}'`);
                // const registros = result1.recordset;

                for (let i = 0; i < result.rowsAffected; i++) {
                    registros.push(result.recordset[i]);
                }

                return registros;

            } catch (error) {
                console.log('SQL error', error);
            }

        }

        const registros = await handlerVerAcciones();
        return res.status(200).json({ ok: true, registros: registros });

    } else {

        const pool1 = new sql.ConnectionPool(config);
        const pool1Connect = pool1.connect();

        pool1.on('error', err => {
            return res.status(401).send(err);
        });

        async function handlerVerAcciones() {

            const registros = [];
            await pool1Connect;

            try {

                const request = pool1.request();

                const result = await request.query(`SELECT ac.ac_folio AS folio, a.a_prioridad AS prioridad, sm.s_nombre AS sub_maquina, ac.ac_comment AS accion FROM d_mantto_anomalias_comments ac INNER JOIN d_mantto_general g ON ac.ac_folio = g.g_folio INNER JOIN c_mantto_actividades a ON ac.ac_actividad = a.id_actividad INNER JOIN c_mantto_sub_maquinas sm ON ac.ac_sub_maquina = sm.id_sub_maquina WHERE g.g_operador = '${sgi}'`);
                // const registros = result1.recordset;

                for (let i = 0; i < result.rowsAffected; i++) {
                    registros.push(result.recordset[i]);
                }

                return registros;

            } catch (error) {
                console.log('SQL error', error);
            }

        }

        const registros = await handlerVerAcciones();
        return res.status(200).json({ ok: true, registros: registros });

    }

}

actividadesCtrl.obtenerImagen = (req, res) => {

    const { tipo, imagen } = req.params;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${imagen}`);
    res.sendFile(pathImg);

}

module.exports = actividadesCtrl;