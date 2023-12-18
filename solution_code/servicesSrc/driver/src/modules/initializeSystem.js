import config from "config";
import dbpool from "./db.js";
import axios from "axios";
import logger from "./logger.js";
import { readFile }  from "fs/promises";
import path from "path";


async function initializeSystem({logger, db}){

    logger.info("Starting Init of Drivers Service")

    // Get config settings
    const tablePrefix = config.get("database.prefix");

    let sqlInit = `DROP TABLE IF EXISTS ${tablePrefix}_driver; `;

    // Load the SQL from the starter file
    let __dirname = path.resolve();

    let sourceSQL = await readFile(__dirname + '/src/sourceData/drivers.sql','utf8');

    // Replace database name with prefixed table name
    sourceSQL = sourceSQL.replace('create table drivers',`create table ${tablePrefix}_driver`);
    sourceSQL = sourceSQL.replaceAll('insert into drivers',`replace into ${tablePrefix}_driver`);


    // Append to SQL
    sqlInit += sourceSQL;

    // Run SQL
    const insertRows = await db.query(sqlInit);
    logger.info("Finished Init of Drivers Service")


}

export default initializeSystem;