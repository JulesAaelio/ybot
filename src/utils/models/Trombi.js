const sequelize = require('sequelize');

'use strict';
module.exports = (db) => {
  const Trombi = db.define('Trombi', {
    userId: sequelize.DataTypes.STRING,
    guildId: sequelize.DataTypes.STRING,
    picture: sequelize.DataTypes.STRING
  }, {});
  Trombi.associate = function(models) {    // associations can be defined here
  };
  return Trombi;

};
