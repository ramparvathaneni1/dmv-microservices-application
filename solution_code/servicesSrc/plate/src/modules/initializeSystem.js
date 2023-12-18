import config from "config";
import { readFile }  from "fs/promises";
import path from "path";


async function initializeSystem({logger, db}){

    logger.info("Starting Init of Plates Service")

    // Get config settings
    const tablePrefix = config.get("database.prefix");

    let sqlInit = `DROP TABLE IF EXISTS ${tablePrefix}_plates; `;

    // Load the SQL from the starter file
    let __dirname = path.resolve();

    let sourceSQL = await readFile(__dirname + '/src/sourceData/plates.sql','utf8');

    // Replace database name with prefixed table name
    sourceSQL = sourceSQL.replace('create table plates',`create table ${tablePrefix}_plates`);
    sourceSQL = sourceSQL.replaceAll('insert into plates',`replace into ${tablePrefix}_plates`);


    // Append to SQL
    sqlInit += sourceSQL;

    // Run SQL
    const insertRows = await db.query(sqlInit);
    logger.info("Finished Init of Plates Service")
}

export default initializeSystem;