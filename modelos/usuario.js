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
        es_administrador: { type: DataTypes.BOOLEAN, defaultValue: false }, //ADMINISTRADOR, ESTUDIANTE
    }, { freezeTableName: true });

    Usuario.associate = function (models) {
        Usuario.hasMany(models.estudiante, { foreignkey: 'id_usuario', as: 'estudiante'});

    };

    return Usuario;
};