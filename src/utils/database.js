const sequelize = require('sequelize');
const requireModels = require('sequelize-require-models');
const retry = require('./retry');

const db = new sequelize(process.env.MYSQL_DATABASE,process.env.MYSQL_USER,process.env.MYSQL_PASSWORD, {
    host: 'db',
    dialect: process.env.DB_DIALECT,
    retry: {
        match: [
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeHostNotReachableError/,
            /SequelizeInvalidConnectionError/,
            /SequelizeConnectionTimedOutError/,
            /SequelizeHostNotFoundError/
        ],
        max: 3
    }
});

const models = requireModels(db,__dirname+'/models');

module.exports = async () => {
    console.log(db);
    try {
        await retry(() => {
            db.authenticate()
        }, 5, 3000);
        console.log("[DB] Connection to the MySQL server established successfully");
    } catch (e) {
        console.log("[DB] Failed to established connection with mysql server", e);
        process.exit(1);
    }

    try {
        await db.sync();
        console.log("[DB] MySQL database has been synchronized");
    } catch (e) {
        console.error("[DB] Error synchronizing MySQL database", e);
        process.exit(1);
    }
    return Object.assign({ db }, models);
};