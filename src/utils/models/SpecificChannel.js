const sequelize = require('sequelize');

module.exports = (db) => {
    const SpecificChannel = db.define('specific_channel', {
        channelId: { type: sequelize.DataTypes.STRING },
        guildId : { type: sequelize.DataTypes.STRING },
        role: { type: sequelize.DataTypes.STRING }
    });
    return SpecificChannel;
};