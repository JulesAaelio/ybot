const sequelize = require('sequelize');

module.exports = (db) => {
    const Validation = db.define('validation', {
        email : { type: sequelize.DataTypes.STRING },
        pseudo: { type: sequelize.DataTypes.STRING },
        token: { type: sequelize.DataTypes.STRING },
    });
    return Validation;
};