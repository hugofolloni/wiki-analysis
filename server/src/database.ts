const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config()

async function connect() {

  const pool = new Pool({
    connectionString:  process.env.URI,
    ssl: {
        rejectUnauthorized: false
    }
  });
 
    //apenas testando a conexão
    return await pool.connect();
}

async function query(sql: string) {
    const connection = await connect();
    const results = await connection.query(sql);
    connection.end()

    return results.rows;
}

module.exports = { query };

/* 
CREATE TABLE page (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    url VARCHAR,
    vector VARCHAR,
    category VARCHAR
);
*/