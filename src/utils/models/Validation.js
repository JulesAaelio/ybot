const sequelize = require('sequelize');

module.exports = (db) => {
    const Validation = db.define('validation', {
        email : { type: sequelize.DataTypes.STRING },
        userId: { type: sequelize.DataTypes.STRING },
        guildId : { type: sequelize.DataTypes.STRING },
        validated: { type: sequelize.DataTypes.BOOLEAN, default: false}
    });
    return Validation;
};