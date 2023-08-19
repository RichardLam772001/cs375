const { Pool } = require("pg");
const env = require("../../dbenv.json");

const pool = new Pool(env);
pool.connect().then(() => {
    console.log("Connected to database");
});

module.exports = { pool };
