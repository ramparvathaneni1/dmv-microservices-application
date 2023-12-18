import config from "config";
import axios from "axios";

async function initializeSystem({logger, db}){

    // Get config settings
    const tablePrefix = config.get("database.prefix");
    const allMakesAPI = config.get("nhtsa.allMakesAPI");
    const rebuildEverything = config.get("init.rebuildData");

    // If force init empty databas
    if(rebuildEverything){
        logger.info("Rebuilding All Data TAbles");
        let modelsTableDelete = `DROP TABLE IF EXISTS ${tablePrefix}_model`;
        let makesTableDelete = `DROP TABLE IF EXISTS ${tablePrefix}_make`;
        const modelsTableDeleteRows = await db.query(modelsTableDelete);
        const makesTableDeleteRows = await db.query(makesTableDelete);
    }


    // Build Tables
    let modelsTableCreate = `CREATE TABLE IF NOT EXISTS ${tablePrefix}_model (
      \`make_id\` int NOT NULL,
      \`model_id\` int NOT NULL,
      \`model_name\` varchar(512) DEFAULT NULL,
      PRIMARY KEY (\`make_id\`,\`model_id\`),
      KEY \`ixModelId\` (\`model_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`
    let makesTableCreate = `CREATE TABLE IF NOT EXISTS ${tablePrefix}_make ( 
      \`make_id\` int NOT NULL,
      \`make_name\` varchar(512) DEFAULT NULL,
      PRIMARY KEY (\`make_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`
    const modelsTableCreateRows = await db.query(modelsTableCreate);
    const makesTableCreateRows = await db.query(makesTableCreate);


    // Get number of records in make database

    let [rows]  = await db.query(`SELECT COUNT(*) as numberOfRows FROM ${tablePrefix}_make;`);

    // If count is 0, then retrieve from nhtsa
    if(rows.length > 0 && rows[0]['numberOfRows'] < 1){
        logger.info("Downloading data from NHTSA");

        let res = await axios.get(allMakesAPI).catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          logger.error("Axios Error: " + allMakesAPI);

        }
      });

        let data = res.data.Results;

        if(data.length > 0){
            logger.info("Downloaded data from NHTSA. Starting Import");

            const batchSize = 1000;
            let insertData = [];
            let sqlInsert = `REPLACE INTO ${tablePrefix}_make (make_id, make_name) VALUES `;
            let insertPlaceholders = [];
            for(let i=0; i<data.length; i++){

                insertPlaceholders.push( `(?,?)`)
                insertData.push(data[i]['Make_ID']);
                insertData.push(data[i]['Make_Name']);

                if( (i+1) % batchSize == 0){
                    // Run the batch
                    sqlInsert = sqlInsert + insertPlaceholders.join(", ");
                    let [rows, fields] = await db.execute(sqlInsert, insertData);


                    // Reset the Data
                    insertData = [];
                    insertPlaceholders=[];
                    sqlInsert = `REPLACE INTO ${tablePrefix}_make (make_id, make_name) VALUES `;
                }

            }

            if(insertData.length > 0){
                // Run the batch
                sqlInsert = sqlInsert + insertPlaceholders.join(", ");
                let [rows, fields] = await db.execute(sqlInsert, insertData);

                // Reset the Data
                insertData = [];
                sqlInsert = "";

            }

            logger.info("Downloaded data from NHTSA. Finished Import");

        }



    }



}

export default initializeSystem;