var modelos = require('../modelos');
var bCrypt = require('bcrypt-nodejs');

var Usuario = modelos.usuario;
var Actividad = modelos.actividad;
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
            es_administrador: true,
        }
    });

    await Actividad.findOrCreate({
        where: { id: 1 },
        defaults: {
            id: 1,
            nombre: 'Selección de imagen',
            descripcion: "Asertar",
            intento: 3,
            estado: true,
        }
    });

    await Actividad.findOrCreate({
        where: { id: 2 },
        defaults: {
            id: 2,
            nombre: 'Cargar imagen',
            descripcion: "Probar modelo",
            intento: 3,
            estado: true,
        }
    });


};
module.exports = init();

