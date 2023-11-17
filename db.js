const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "PersonalBudget",
    password: "postgres",
    port: "5432"
});

const query = (queryString, parameters, callback) => {
    const result = pool.query(queryString, parameters, callback)
    return result;
};

module.exports = { pool, query };