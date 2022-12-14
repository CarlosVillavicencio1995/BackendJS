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
router.post('/crea_estudiante', Controlador.crea_estudiante);
router.post('/crea_resultado', Controlador.crea_resultado);
router.get('/listar_usuario', Controlador.listar_usuario);
router.get('/listar_actividad', Controlador.listar_actividad);
router.get('/listar_resultado', Controlador.listar_resultado);
router.post('/predecir_imagen', Controlador.predecir_imagen);
router.post('/predecir_ruta', Controlador.predecir_ruta);
router.post('/listar_imagen', Controlador.listar_imagen);
router.post('/crea_grupo', Controlador.crea_grupo);
router.get('/listar_grupo/:id_usuario', Controlador.listar_grupo);


module.exports = router;
