'use strict';
var tf = require('@tensorflow/tfjs-node');
var fs = require('fs');

var bCrypt = require('bcrypt-nodejs');
var formidable = require('formidable');
var { Op } = require("sequelize");
var modelos = require('../modelos');
var Usuario = modelos.usuario;
var Actividad = modelos.actividad;
var Resultado = modelos.resultado;
var Grupo = modelos.grupo;
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
            var usuario = await Usuario.findOne({ where: { correo: correo } });
            if (usuario != undefined && bCrypt.compareSync(clave, usuario.clave)) {
                UtilMetodo.succeesServer(req, res, usuario, GlobalApp.mensaje_usuario_iniciado_sesion);
            } else {
                UtilMetodo.errorServer(req, res, "", GlobalApp.mensaje_credenciales_invalidas);
            }
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }

    }


    /** @api {post} /crear_usuario Crear usuario
    @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiParam {String} correo Requerido correo del usuario
    @apiParam {String} clave Requerido clave del usuario
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async crear_usuario(req, res) {
        try {
            let { nombre, apellido, cedula, correo, clave, facultad, carrera } = req.body; //usuario
            var data = { nombre, apellido, cedula, correo, clave, facultad, carrera };
            UtilMetodo.validarCampos(data);
            var usuario = await Usuario.findOne({ where: { correo: correo } });
            if (usuario?.correo != correo) {
                data.clave = bCrypt.hashSync(data.clave, bCrypt.genSaltSync(8), null);
                var usuario = await Usuario.create(data);
                UtilMetodo.succeesServer(req, res, null, GlobalApp.mensaje_guardar_ok);
            } else {
                throw { mensaje: GlobalApp.mensaje_usuario_registrado };
            }
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }

    }

    /** @api {get} /crea_estudiante Inciar sesión
    @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async listar_usuario(req, res) {
        try {
            var usuarios = await Usuario.findAll({});
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


    /** @api {post} /crear_grupo Crear grupo
     @apiName Inciar sesión
     @apiGroup usuario
     @apiDescription Permite iniciar sesion
     @apiParam {String} correo Requerido correo del usuario
     @apiParam {String} clave Requerido clave del usuario
     @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
     @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async crear_grupo(req, res) {
        try {
            let { nombre, descripcion, codigo, usuarioId, laboratorioId } = req.body;
            var data_grupo = { nombre, descripcion, codigo, usuarioId, laboratorioId };
            UtilMetodo.validarCampos(data_grupo);
            data_grupo.estado = true;
            var grupo = await Grupo.findOne({ where: { codigo } });
            if (grupo?.codigo == codigo) throw { mensaje: "Ya existe un grupo con este código" };
            var usuario = await Usuario.findOne({ where: { id: usuarioId } });
            if (!usuario?.es_administrador) throw { mensaje: "El usuario no es administrador" };
            await Grupo.create(data_grupo);
            UtilMetodo.succeesServer(req, res, null, GlobalApp.mensaje_guardar_ok);
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }
    }


    /** @api {post} /listar_grupo Crear grupo
     @apiName Inciar sesión
     @apiGroup usuario
     @apiDescription Permite iniciar sesion
     @apiParam {String} correo Requerido correo del usuario
     @apiParam {String} clave Requerido clave del usuario
     @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
     @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async listar_grupo(req, res) {
        try {
            let { usuarioId } = req.params;
            var data_grupo = { usuarioId };
            UtilMetodo.validarCampos(data_grupo);
            var grupos = await Grupo.findAll(data_grupo);
            UtilMetodo.succeesServer(req, res, { grupos }, GlobalApp.mensaje_consulta);
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }
    }


    /** @api {post} /matricular_grupo Crear grupo
    @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiParam {String} correo Requerido correo del usuario
    @apiParam {String} clave Requerido clave del usuario
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async sub_grupo(req, res) {
        try {
            let { codigo, usuarioId } = req.body;
            UtilMetodo.validarCampos({ codigo, usuarioId });
            var grupo = await Grupo.findOne({ where: { codigo } });
            if (grupo?.codigo != codigo) throw { mensaje: "No existe un grupo con este código" };
            if (!grupo?.estado) throw { mensaje: "Este grupo esta inactivo" };
            var usuario = await Usuario.findOne({ where: { id: usuarioId } });
            if (!usuario) throw { mensaje: "El usuario no existe" };
            var grupo_subs = JSON.parse(usuario.grupo_subs);
            const esta_sub = grupo_subs.find(e => e == grupo.id);
            if (esta_sub) throw { mensaje: "Ya estas matriculado a este grupo" };
            grupo_subs.push(grupo.id);
            await Usuario.update({
                grupo_subs: JSON.stringify(grupo_subs),
            }, { where: { id: usuarioId } });
            UtilMetodo.succeesServer(req, res, null, GlobalApp.mensaje_guardar_ok);
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }
    }

    /** @api {post} /listar_grupo Crear grupo
    @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiParam {String} correo Requerido correo del usuario
    @apiParam {String} clave Requerido clave del usuario
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async listar_mis_subs(req, res) {
        try {
            let { usuarioId } = req.params;
            UtilMetodo.validarCampos({ usuarioId });
            var usuario = await Usuario.findOne({ where: { id: usuarioId } });
            if (!usuario) throw { mensaje: "El usuario no existe" };
            var grupo_subs = JSON.parse(usuario.grupo_subs);
            var grupos = [];
            for (const id of grupo_subs) {
                var grupo = await Grupo.findOne({ where: { id, estado: true } });
                if (grupo) grupos.push(grupo);
            }
            UtilMetodo.succeesServer(req, res, { grupos }, GlobalApp.mensaje_consulta);
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }
    }

    /** @api {post} /matricular_grupo Crear grupo
   @apiName Inciar sesión
   @apiGroup usuario
   @apiDescription Permite iniciar sesion
   @apiParam {String} correo Requerido correo del usuario
   @apiParam {String} clave Requerido clave del usuario
   @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
   @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async info_grupo(req, res) {
        try {
            let { codigo } = req.params;
            UtilMetodo.validarCampos({ codigo });
            var grupo = await Grupo.findOne({ where: { codigo } });
            if (grupo?.codigo != codigo) throw { mensaje: "No existe un grupo con este código" };

            var usuarios = await Usuario.findAll({
                where: { grupo_subs: { [Op.like]: `%${grupo.id}%` } },
            });
            usuarios = JSON.parse(JSON.stringify(usuarios));
            grupo = JSON.parse(JSON.stringify(grupo));

            grupo.usuarios_subs = usuarios.length;
            grupo.usuarios = usuarios;

            UtilMetodo.succeesServer(req, res, grupo, GlobalApp.mensaje_guardar_ok);
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }
    }

    /** @api {post} /editar_grupo Crear grupo
     @apiName Inciar sesión
     @apiGroup usuario
     @apiDescription Permite iniciar sesion
     @apiParam {String} correo Requerido correo del usuario
     @apiParam {String} clave Requerido clave del usuario
     @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
     @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async editar_grupo(req, res) {
        try {
            let { nombre, descripcion, codigo, estado } = req.body;
            var data_grupo = {};
            UtilMetodo.validarCampos({ codigo });
            if (nombre != undefined) data_grupo.nombre = nombre;
            if (descripcion != undefined) data_grupo.descripcion = descripcion;
            if (estado != undefined) data_grupo.estado = estado;
            await Grupo.update(data_grupo, { where: { codigo } });
            UtilMetodo.succeesServer(req, res, null, GlobalApp.mensaje_actualizar_ok);
        } catch (err) {
            UtilMetodo.errorServer(req, res, err);
        }
    }


    /** @api {post} /crear_resultado Inciar sesión
    @apiName Inciar sesión
    @apiGroup usuario
    @apiDescription Permite iniciar sesion
    @apiParam {String} correo Requerido correo del usuario
    @apiParam {String} clave Requerido clave del usuario
    @apiSuccess {Object} object{"mensaje": "Bienvenido","tipo": "success", "data": {}, "mensaje_alterno": ""}
    @apiError {Object} object{"mensaje": "Ocurrió un error intente más tarde","tipo": "error","mensaje_alterno": ""}*/
    async crear_resultado(req, res) {
        try {
            let { observacion, actividadId, usuarioId } = req.body;
            var data_resultado = { observacion, actividadId, usuarioId };
            UtilMetodo.validarCampos(data_resultado);
            await Resultado.create(data_resultado);
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
            var { actividadId, usuarioId } = req.params;
            var resultados = await Resultado.findAll({
                where: { actividadId, usuarioId },
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

    }

    /** @api {post} /predecir_ruta Inciar sesión
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






