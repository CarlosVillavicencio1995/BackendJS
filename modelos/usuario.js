'use strict';
module.exports = (sequelize, DataTypes) => {

    const Usuario = sequelize.define('usuario', {
        nombre: { type: DataTypes.STRING },
        apellido: { type: DataTypes.STRING },
        cedula: { type: DataTypes.STRING },
        correo: {
            type: DataTypes.STRING,
            unique: true
        },
        clave: { type: DataTypes.STRING },
        facultad: { type: DataTypes.STRING },
        carrera: { type: DataTypes.STRING },
        es_administrador: { type: DataTypes.BOOLEAN, defaultValue: false }, //ADMINISTRADOR, ESTUDIANTE
        grupo_subs: { type: DataTypes.TEXT, defaultValue: "[]" },
    }, { freezeTableName: true });

    Usuario.associate = function (models) {
        Usuario.hasMany(models.grupo);
        // Usuario.hasMany(models.laboratorio);
        Usuario.hasMany(models.resultado);
    };

    return Usuario;
};