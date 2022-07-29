'use strict';
var GlobalApp = require('./global_app');
var path = require('path');
var fs = require('fs');
var maxFileSize = 4097152; //unidades bytes => 4MB
var extensiones = ["jpg", "png", "jpeg"];

exports.errorServer = async function (req, res, error, mensaje, tipo) {
    try {
        mensaje = error.mensaje ?? mensaje;
        if (error.mensaje == undefined) error = error?.toString();
    } catch (error) {
        error = error?.toString();
    }
    var json = {
        mensaje: mensaje ?? GlobalApp.mensaje_error_servidor,
        tipo: tipo ?? GlobalApp.tipo_error,
        mensaje_alterno: error ?? "",
        url: req.originalUrl,
        ip: req.ip,
    };
    if (GlobalApp.imprimir_logs) {
        console.log("___________________________ INNCIO DE ERROR ___________________________ \n");
        console.log(error);
        console.log("\n ___________________________ FIN DE ERROR ___________________________ \n");
    }
    await set_header(req, res, json);
    res.status(200).json(json);
}

exports.succeesServer = async function (req, res, data, mensaje, mensaje_alterno) {
    var json = {
        mensaje: mensaje ?? GlobalApp.mensaje_success,
        tipo: GlobalApp.tipo_success,
        data: data ?? {},
        mensaje_alterno: mensaje_alterno ?? "",
        url: req.originalUrl,
    };
    await set_header(req, res, json);
    res.status(200).json(json);
}

async function set_header(req, res, json) {
    await res.setHeader("Content-Type", "application/json");
    if (GlobalApp.imprimir_logs) {
        console.log("___________________________ INFORMACIÓN ___________________________ \n");
        console.log(json);
        console.log("\n ___________________________ FIN INFORMACION ___________________________ \n");
    }
}



exports.validarCampos = function (list) {
    var info = "";
    for (const item in list) { if (list[item] == undefined || list[item] == "") info += `${item}, `; }
    if (info != "") {
        info = info.trim().substring(0, info.length - 2)
        throw { mensaje: `Campos obligatorios: ${info}` };
    }
}


exports.obtener_dir = function () {
    return static_obtener_dir();
}

function static_obtener_dir() {
    var dir = path.join(__dirname, '../public');
    dir = dir.replace(new RegExp(/\\/g), '/');
    return dir;
}

exports.guardar_imagen = function (file, ruta, fn) {
    if (file.size != 0) {
        if (file.size <= maxFileSize) {
            var extension = file.name.split(".").pop().toLowerCase();
            if (extensiones.includes(extension)) {
                var oldpath = file.path;
                var nombre = file.name.replaceAll(" ", "");
                fs.readFile(oldpath, async function (err, data) {
                    // Write the file
                    var strPath = static_obtener_dir();
                    var dir = strPath + ruta;
                    fs.writeFile((dir + nombre), data, function (err) {
                        if (err) {
                            console.log('ERROR' + err);
                            fn({
                                estado: -1,
                                mensaje: 'Experimetamos un error, intente más tarde.',
                            });
                        } else {
                            fn({
                                estado: 1,
                                nombre: ruta + nombre,
                            });
                        }
                    });

                });
            } else {
                fn({
                    estado: -1,
                    mensaje: 'El formato de la imágen no es el correcto',
                });
            }
        } else {
            fn({
                estado: -1,
                mensaje: 'El tamaño máximo de la imágen para subir es de 4 MB',
            });
        }
    } else {
        fn({
            estado: -1,
            mensaje: 'No se cargo ninguna imagen, vuelva a intentarlo.',
        });
    }
}

exports.eliminarArchivo = function (ruta, fn) {
    var strPath = static_obtener_dir();
    strPath = strPath.replace(new RegExp(/\\/g), '/');
    var dir = strPath + ruta;
    if (fs.existsSync(dir)) {
        fs.unlink(dir, async (err) => {
            if (err) {
                console.log(err);
                fn({ estado: -1 });
            } else {
                fn({ estado: 1 });
            }
        });
    } else {
        fn({ estado: 1 });
    }
}
