'use strict';
module.exports = (sequelize, DataTypes) => {

    const Resultado = sequelize.define('resultado', {
        observacion: {type: DataTypes.STRING},
    }, {freezeTableName: true});

    Resultado.associate = function (models) {
        Resultado.belongsTo(models.actividad, { as: 'actividad', constraints: false });
        Resultado.belongsTo(models.usuario, { as: 'usuario', constraints: false });
    };
    
    return Resultado;
};