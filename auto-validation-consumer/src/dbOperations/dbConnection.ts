import pgp from 'pg-promise'
require('dotenv').config();
const envVars = process.env;
const pgPromise = pgp();
console.log(envVars)
let cn = {
    user: envVars.DB_USER,
    password: envVars.DB_PASS,
    database: envVars.DB_NAME,
    host: envVars.DB_HOST,
    logging: false,
    dialect: 'postgres',
    ssl: false,
    dialectOptions: {
        ssl: false,
    },
    operatorsAliases: false,
};

const db = pgPromise(cn);

export default db