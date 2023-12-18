import config from "config";

const tablePrefix = config.get("database.prefix");

export async function getMake({logger, db}){

    logger.info("Make: Get all Makes");

    // Create query to get data
    const sql = `SELECT * FROM ${tablePrefix}_make`;

    let [rows]  = await db.query(sql);

    // Build Results array of objects
    let results = [];

    for(let i=0;i<rows.length;i++){
        results.push(rows[i]);
    }

    // Return results

    return results;
}
