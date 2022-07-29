'use strict';
module.exports = (sequelize, DataTypes) => {

    const Resultado = sequelize.define('resultado', {
        observacion: {type: DataTypes.STRING},
    }, {freezeTableName: true});

    Resultado.associate = function (models) {
        Resultado.belongsTo(models.estudiante, {foreignkey: 'id_estudiante'});
        Resultado.belongsTo(models.actividad, {foreignkey: 'id_actividad'});
    };
    
    return Resultado;
};