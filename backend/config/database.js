// Description: Database connection configuration.

const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
})

pool.connect((err) => {
    if (err) throw err
    console.log('Connect to PostgreSQL successfully!');
})

module.exports = pool