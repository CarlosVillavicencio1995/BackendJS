'use strict';
module.exports = (sequelize, DataTypes) => {

    const Laboratorio = sequelize.define('laboratorio', {
        nombre: { type: DataTypes.STRING },
        estado: { type: DataTypes.BOOLEAN },
        descripcion: { type: DataTypes.STRING },
    }, { freezeTableName: true });

    Laboratorio.associate = function (models) {
        Laboratorio.hasMany(models.actividad);
        Laboratorio.belongsTo(models.grupo, { as: 'grupo', constraints: false })
        Laboratorio.belongsTo(models.usuario, { as: 'usuario', constraints: false })
    };

    return Laboratorio;
};