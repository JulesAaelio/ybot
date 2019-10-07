'use strict';
module.exports = (sequelize, DataTypes) => {
  const Trombi = sequelize.define('Trombi', {
    userId: DataTypes.STRING,
    guildId: DataTypes.STRING,
    picture: DataTypes.STRING
  }, {});
  Trombi.associate = function(models) {
    // associations can be defined here
  };
  return Trombi;
};