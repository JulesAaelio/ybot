const sequelize = require('sequelize');

module.exports = (db) => {
    const PredefinedRole = db.define('predefined_role', {
        email : { type: sequelize.DataTypes.STRING },
        guildId : { type: sequelize.DataTypes.STRING },
        roles: { type: sequelize.DataTypes.STRING, default: false}
    });
    return PredefinedRole;
};