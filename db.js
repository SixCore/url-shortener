const mariadb = require("mariadb");

const pool = mariadb.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "ghm888zun",
    database: "shorten"
});

module.exports = {
    getConnection: () => {
        return new Promise((resolve, reject) => {
            pool.getConnection().then((connection) => {
                resolve(connection);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}