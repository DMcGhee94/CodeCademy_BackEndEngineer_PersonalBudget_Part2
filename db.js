const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "PersonalBudget",
    password: "postgres",
    port: "5432"
});

const query = (queryString, parameters, callback) => {
    return pool.query(queryString, parameters, callback);
};

module.exports = { pool, query };