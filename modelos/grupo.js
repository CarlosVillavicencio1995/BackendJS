'use strict';
module.exports = (sequelize, DataTypes) => {

    const Grupo = sequelize.define('grupo', {
        nombre: { type: DataTypes.STRING },
        descripcion: { type: DataTypes.STRING },
        codigo: { type: DataTypes.STRING },
        estado: { type: DataTypes.BOOLEAN },
    }, { freezeTableName: true });

    Grupo.associate = function (models) {
        Grupo.belongsTo(models.usuario, { as: 'usuario', constraints: false });
        // Grupo.hasMany(models.laboratorio);
        Grupo.belongsTo(models.laboratorio, { as: 'laboratorio', constraints: false });
    };

    return Grupo;
};