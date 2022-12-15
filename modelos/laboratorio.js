'use strict';
module.exports = (sequelize, DataTypes) => {

    const Laboratorio = sequelize.define('laboratorio', {
        nombre: { type: DataTypes.STRING },
        descripcion: { type: DataTypes.STRING },
        estado: { type: DataTypes.BOOLEAN },
    }, { freezeTableName: true });

    Laboratorio.associate = function (models) {
        Laboratorio.hasMany(models.actividad);
        Laboratorio.hasMany(models.grupo);
        // Laboratorio.belongsTo(models.grupo, { as: 'grupo', constraints: false })
        //Laboratorio.belongsTo(models.usuario, { as: 'usuario', constraints: false });
    };

    return Laboratorio;
};