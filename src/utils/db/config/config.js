const database = {
    "username": process.env.MYSQL_USER,
        "password": process.env.MYSQL_PASSWORD,
        "database": process.env.MYSQL_DATABASE,
        "host": "db",
        "dialect": "mysql"
}

module.exports = {
    dev: database,
    development: database,
    prod: database,
};