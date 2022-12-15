var express = require('express');
var router = express.Router();

var controlador = require('../controladores/controlador');
var Controlador = new controlador();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).json({
    titulo: 'Bienvenido',
  });
});

router.get('/sincronizar_base', Controlador.sincronizar_base);
router.post('/iniciar_sesion', Controlador.iniciar_sesion);
//
router.post('/crear_usuario', Controlador.crear_usuario);
router.post('/crear_resultado', Controlador.crear_resultado);
router.post('/crear_grupo', Controlador.crear_grupo);
router.post('/sub_grupo', Controlador.sub_grupo);
router.post('/editar_grupo', Controlador.editar_grupo);
//
router.get('/listar_usuario', Controlador.listar_usuario);
router.get('/listar_actividad', Controlador.listar_actividad);
router.get('/listar_resultado/:actividadId/:usuarioId', Controlador.listar_resultado);
router.get('/listar_imagen', Controlador.listar_imagen);
router.get('/listar_grupo/:usuarioId', Controlador.listar_grupo);
router.get('/listar_mis_subs/:usuarioId', Controlador.listar_mis_subs);
router.get('/info_grupo/:codigo', Controlador.info_grupo);

router.post('/predecir_imagen', Controlador.predecir_imagen);
router.post('/predecir_ruta', Controlador.predecir_ruta);

module.exports = router;
