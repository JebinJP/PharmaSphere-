const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const initDb = async () => {
    const dbName = process.env.DB_NAME;

    // 1. Connect to default 'postgres' database to check/create target DB
    const clientRoot = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: 'postgres',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await clientRoot.connect();

        // Check if database exists
        const res = await clientRoot.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        if (res.rowCount === 0) {
            console.log(`Database '${dbName}' does not exist. Creating...`);
            await clientRoot.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database '${dbName}' created.`);
        } else {
            console.log(`Database '${dbName}' already exists.`);
        }
    } catch (err) {
        console.error('Error checking/creating database:', err);
        process.exit(1);
    } finally {
        await clientRoot.end();
    }

    // 2. Connect to the target database to run init SQL
    const clientTarget = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: dbName,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await clientTarget.connect();
        const sqlPath = path.join(__dirname, '../models/init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running schema initialization...');
        await clientTarget.query(sql);
        console.log('Schema initialized successfully!');
    } catch (err) {
        console.error('Error initializing schema:', err);
    } finally {
        await clientTarget.end();
    }
};

initDb();
