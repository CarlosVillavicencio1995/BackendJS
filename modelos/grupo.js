'use strict';
module.exports = (sequelize, DataTypes) => {

    const Grupo = sequelize.define('grupo', {
        nombre: { type: DataTypes.STRING },
        n_integrantes: { type: DataTypes.STRING },
        codigo: { type: DataTypes.STRING },
    }, { freezeTableName: true });

    Grupo.associate = function (models) {
        Grupo.belongsTo(models.usuario, { as: 'usuario', constraints: false })
        Grupo.hasMany(models.laboratorio)
    };

    return Grupo;
};