var modelos = require('../modelos');
var bCrypt = require('bcrypt-nodejs');

var Usuario = modelos.usuario;
var Actividad = modelos.actividad;
var Laboratorio = modelos.laboratorio;
var Grupo = modelos.grupo;
var GlobalApp = require('./global_app');

var init = async function () {


    await Usuario.findOrCreate({
        where: { id: 1 },
        defaults: {
            id: 1,
            nombre: 'Bryan',
            apellido: 'Requenes',
            cedula: "11052790144",
            correo: 'bryan.requenes@unl.edu.ec',
            clave: bCrypt.hashSync('123456789', bCrypt.genSaltSync(8), null),
            facultad: "FEIRNNR",
            carrera: "Ingeniería en Sistemas",
            es_administrador: true,
        }
    });

    await Laboratorio.findOrCreate({
        where: { id: 1 },
        defaults: {
            id: 1,
            nombre: 'Melanoma',
            descripcion: "Melanoma",
            estado: true,
        }
    });


    await Grupo.findOrCreate({
        where: { id: 1 },
        defaults: {
            id: 1,
            nombre: 'Grupo 1',
            descripcion: "Melanoma",
            codigo: "grupo1",
            estado: true,
            usuarioId: 1,
            laboratorioId: 1,
        }
    });

    await Actividad.findOrCreate({
        where: { id: 1 },
        defaults: {
            id: 1,
            nombre: 'Información',
            descripcion: "Información",
            intento: 3,
            estado: true,
            laboratorioId: 1,
        }
    });

    await Actividad.findOrCreate({
        where: { id: 2 },
        defaults: {
            id: 2,
            nombre: 'Selección de imagen',
            descripcion: "Asertar",
            intento: 3,
            estado: true,
            laboratorioId: 1,
        }
    });

    await Actividad.findOrCreate({
        where: { id: 3 },
        defaults: {
            id: 3,
            nombre: 'Cargar imagen',
            descripcion: "Probar modelo",
            intento: 3,
            estado: true,
            laboratorioId: 1,
        }
    });


};
module.exports = init();

