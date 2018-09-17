const sequelize = require('sequelize');
const requireModels = require('sequelize-require-models');
const db = new sequelize(process.env.MYSQL_DATABASE,process.env.MYSQL_USER,process.env.MYSQL_PASSWORD,{
    host: 'db',
    dialect: process.env.DB_DIALECT
});

db.authenticate().then((r) => {
    console.log("[DATABASE] Connection established");
}).catch(e => {
    console.error(e);
});

const models = requireModels(db,__dirname+'/models');

// Sync database
db.sync().then((r)=> {
    console.log("[DATABASE] Database synchronised");
}).catch(e => {
    console.error(e);
});

module.exports = Object.assign({ db }, models);