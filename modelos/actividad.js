'use strict';
module.exports = (sequelize, DataTypes) => {

    const Actividad = sequelize.define('actividad', {
        nombre: DataTypes.STRING,
        descripcion: DataTypes.STRING,
        intento: DataTypes.INTEGER,
        estado: DataTypes.BOOLEAN,
    }, { freezeTableName: true });

    Actividad.associate = function (models) {
        Actividad.belongsTo(models.laboratorio, { as: 'laboratorio', constraints: false });
        Actividad.hasMany(models.resultado);
    };
    return Actividad;
};