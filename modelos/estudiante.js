'use strict';
module.exports = (sequelize, DataTypes) => {

    const Estudiante = sequelize.define('estudiante', {
        ciclo: { type: DataTypes.STRING },
        paralelo: { type: DataTypes.STRING },
        carrera: { type: DataTypes.STRING },
    }, { freezeTableName: true });

    Estudiante.associate = function (models) {
        Estudiante.belongsTo(models.usuario, {foreignkey: 'id_usuario'});
        Estudiante.hasMany(models.resultado, { foreignkey: 'id_estudiante', as: 'resultado' });  //
    };

    return Estudiante;
};