'use strict';
var tf = require('@tensorflow/tfjs-node');
var fs = require('fs');

var bCrypt = require('bcrypt-nodejs');
var formidable = require('formidable');
var modelos = require('../modelos');
var Usuario = modelos.usuario;
var Estudiante = modelos.estudiante;
var Actividad = modelos.actividad;
var Resultado = modelos.resultado;
var GlobalApp = require('./global_app');
var UtilMetodo = require('./util_metodo');
var tipos_datos = ['MELANOMA', 'NO_MELANOMA'];
class Controlador {

    async sincronizar_base(req, res) {
        //modelos
        modelos.sequelize.sync().then(async () => {
            await require('./init');
            res.status(200).json({
                codigo: '200',
                title: ' Sincronización exitosa',
                msj: 'Se realizo su sincronización con éxito, utilice la acción a continuación.',

            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                codigo: '500',
                title: ' Sincronización no exitosa',
                msj: 'Desafortunadamente, estamos teniendo problemas para cargar la página que está buscando. Espere un momento e inténtelo de nuevo o utilice la acción a continuación.',
            });
        });

    }

    /** @api {post} /iniciar_sesion Inciar sesión
    @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiParam {String} correo Requerido correo del usuario
    @apiParam {String} clave Requerido clave del usuario
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async iniciar_sesion(req, res) {
        try {
            var correo = req.body.correo;
            var clave = req.body.clave;
            UtilMetodo.validarCampos({ correo, clave });
            var usuario = await Usuario.findOne({ where: { correo: correo }, include: { model: Estudiante, as: 'estudiante' } });
            if (usuario != undefined && bCrypt.compareSync(clave, usuario.clave)) {
                UtilMetodo.succeesServer(req, res, usuario, GlobalApp.mensaje_usuario_iniciado_sesion);
            } else {
                UtilMetodo.errorServer(req, res, "", GlobalApp.mensaje_credenciales_invalidas);
            }
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }

    }


    /** @api {post} /crea_estudiante Inciar sesión
    @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiParam {String} correo Requerido correo del usuario
    @apiParam {String} clave Requerido clave del usuario
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async crea_estudiante(req, res) {
        try {
            let { nombre, apellido, cedula, correo, clave } = req.body; //usuario
            let { ciclo, paralelo, carrera } = req.body; //estudiante
            var data_usuario = { nombre, apellido, cedula, correo, clave };
            var data_estudiante = { ciclo, paralelo, carrera };
            UtilMetodo.validarCampos(data_usuario);
            UtilMetodo.validarCampos(data_estudiante);
            var usuario = await Usuario.findOne({ where: { correo: correo } });
            if (usuario?.correo != correo) {
                data_usuario.clave = bCrypt.hashSync(data_usuario.clave, bCrypt.genSaltSync(8), null);
                var usuario = await Usuario.create(data_usuario);
                data_estudiante.usuarioId = usuario.id;
                var estudiante = await Estudiante.create(data_estudiante);
                UtilMetodo.succeesServer(req, res, null, GlobalApp.mensaje_guardar_ok);
            } else {
                throw { mensaje: GlobalApp.mensaje_usuario_registrado };
            }
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }

    }

    /** @api {post} /crea_estudiante Inciar sesión
    @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async listar_usuario(req, res) {
        try {
            var usuarios = await Usuario.findAll({ include: { model: Estudiante, as: 'estudiante' } });
            UtilMetodo.succeesServer(req, res, { usuarios }, GlobalApp.mensaje_consulta);
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }

    }


    /** @api {post} /crea_estudiante Inciar sesión
    @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async listar_actividad(req, res) {
        try {
            var actividades = await Actividad.findAll({});
            UtilMetodo.succeesServer(req, res, { actividades }, GlobalApp.mensaje_consulta);
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }

    }

    /** @api {post} /crea_resultado Inciar sesión
    @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiParam {String} correo Requerido correo del usuario
    @apiParam {String} clave Requerido clave del usuario
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async crea_resultado(req, res) {
        try {
            let { observacion, actividadId, estudianteId } = req.body;
            var data_resultado = { observacion, actividadId, estudianteId };
            console.log(data_resultado);
            UtilMetodo.validarCampos(data_resultado);
            var resultado = await Resultado.create(data_resultado);
            UtilMetodo.succeesServer(req, res, null, GlobalApp.mensaje_guardar_ok);
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }
    }

    /** @api {post} /crea_estudiante Inciar sesión
    @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async listar_resultado(req, res) {
        try {
            var { actividadId, estudianteId } = req.body;
            var exclude = ["actividadId", 'estudianteId'];
            var where_a = {};
            var where_e = {};
            if (actividadId != undefined) where_a.id = actividadId;
            if (estudianteId != undefined) where_e.id = estudianteId;
            var resultados = await Resultado.findAll({
                include: [
                    { model: Actividad, where: where_a },
                    { model: Estudiante, where: where_e, include: { model: Usuario } }
                ],
                attributes: { exclude }
            });
            UtilMetodo.succeesServer(req, res, { resultados }, GlobalApp.mensaje_consulta);
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }

    }

    /** @api {post} /crea_estudiante Inciar sesión
    @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async predecir_imagen(req, res) {
        try {
            var form = new formidable.IncomingForm();
            form.parse(req, async function (err, fields, files) {
                var imagen = files.imagen;
                if (imagen == undefined) throw { mensaje: GlobalApp.mensaje_archivo_no };
                var rutaPatch = `/imagenes/cache/`;
                UtilMetodo.guardar_imagen(imagen, rutaPatch, async function (response) {
                    if (response.estado == 1) {
                        try {
                            var imagePath = UtilMetodo.obtener_dir() + response.nombre;
                            var data = await predecir(imagePath);
                            UtilMetodo.eliminarArchivo(response.nombre, (data) => console.log(data));
                            UtilMetodo.succeesServer(req, res, data, GlobalApp.mensaje_consulta);
                        } catch (error) {
                            UtilMetodo.errorServer(req, res, error);
                        }
                    } else {
                        UtilMetodo.errorServer(req, res, response.mensaje, response.mensaje);
                    }
                });

            });
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }
    }

    /** @api {post} /crea_estudiante Inciar sesión
    @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async predecir_ruta(req, res) {
        try {
            var ruta = req.body.ruta;
            UtilMetodo.validarCampos({ ruta });
            var imagePath = UtilMetodo.obtener_dir() + ruta;
            console.log(imagePath);
            if (fs.existsSync(imagePath)) {
                var data = await predecir(imagePath);
                UtilMetodo.succeesServer(req, res, data, GlobalApp.mensaje_consulta);
            } else {
                throw { mensaje: "No existe archivo" };
            }
        } catch (error) {
            UtilMetodo.errorServer(req, res, error);
        }
    }

    /** @api {post} /crea_estudiante Inciar sesión
     @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async listar_imagen(req, res) {
        try {
            var strPath = UtilMetodo.obtener_dir();
            var melanomas = fs.readdirSync(`${strPath}/imagenes/melanoma/`);
            var no_melanomas = fs.readdirSync(`${strPath}/imagenes/no_melanoma/`);
            var link_p = GlobalApp.link + '/imagenes';
            var imagenes = [];
            var total = 6;
            var total_melanoma = 2;
            var total_no_melanoma = total - total_melanoma;
            for (let i = 0; i < total_melanoma; i++) {
                var randon = Math.floor(Math.random() * melanomas.length);
                imagenes.push({
                    imagen: link_p + '/melanoma/' + melanomas[randon],
                    path: '/imagenes/melanoma/' + melanomas[randon],
                    tipo: tipos_datos[0],
                });
            }
            for (let i = 0; i < total_no_melanoma; i++) {
                var randon = Math.floor(Math.random() * no_melanomas.length);
                imagenes.push({
                    imagen: link_p + '/no_melanoma/' + no_melanomas[randon],
                    path: '/imagenes/no_melanoma/' + no_melanomas[randon],
                    tipo: tipos_datos[1],
                });
            }
            imagenes = imagenes.sort(() => Math.random() - 0.8);
            imagenes = imagenes.sort(() => Math.random() - 0.2);
            UtilMetodo.succeesServer(req, res, { imagenes }, GlobalApp.mensaje_guardar_ok);
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }
    }
}

async function predecir(imagePath) {
    var link_modelo = GlobalApp.link + '/modelo/modelo.json';
    var model = await tf.loadLayersModel(link_modelo);
    var imagen = processImage(imagePath);
    var predict = model.predict(imagen);
    var valores = predict.dataSync();
    var resultado = "";
    if (valores[0] > valores[1]) {
        resultado = tipos_datos[0];
    } else {
        resultado = tipos_datos[1];
    }
    valores = [valores[0], valores[1]];
    return { resultado, valores };
}

function processImage(path) {
    const imageBuffer = fs.readFileSync(path);
    var image = tf.node.decodeImage(imageBuffer, 3);
    image = tf.image.resizeBilinear(image, [224, 224]);
    image = image.expandDims();
    return image;
}
module.exports = Controlador;






