import config from "config";
import axios from "axios";

const tablePrefix = config.get("database.prefix");
const modelsAPI = config.get("nhtsa.modelsAPI");


export async function getModels(makes, {logger, db}){

    logger.info("Model Request Starting");
    // Remove non-numbers from makes array and validate array

    if(typeof makes != "object"){
        logger.error("Model Request: Invalid make request");
        return false;
    }

    // Ensure that only numbers are in the requested makes
    for(let i =0;i<makes.length;i++){
        let intvalid = parseInt(makes[i])
        if(!isNaN(intvalid)){
            makes[i] = intvalid;
        }else{
            makes.splice(i, 1);
        }
    }



    if(makes.length == 0){
        logger.error("Model Request: Invalid make request");
        return false;
    }

    let makesRequestedFilteredString = makes.join(",");

    logger.info("Model Request for Makes: " + makesRequestedFilteredString);

    // Check to see if data is present for all makes
    let sql = "SELECT make_id FROM " + tablePrefix + "_model WHERE make_id IN ("+makesRequestedFilteredString+") GROUP BY make_id";

    let [rows] = await db.query(sql);

    for(let i=0;i<rows.length;i++){
        // If id is in the row, remove it from the list
        let theIndex = makes.indexOf(rows[i]['make_id']);
        if(theIndex > -1){
            makes.splice(theIndex, 1);
        }
    }
    
    if(makes.length > 0){
        // There are missing makes

        // Get any missing model data
        for(let q=0;q<makes.length;q++){
            logger.info("Model Request: Missing Make: " + makes[q]);

            let modelsAPISingle = modelsAPI.replace('{makeID}',makes[q]);

            let res = await axios.get(modelsAPISingle).catch(function (error) {
                if (error.response) {
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                  logger.error("Axios Error: " + modelsAPISingle);

                }
            });
            let data = res.data.Results;

            // Insert makes into database
            if(data.length > 0){
                logger.info("Downloaded Model data from NHTSA. Starting Import");

                const batchSize = 1000;
                let insertData = [];
                let sqlInsert = `REPLACE INTO ${tablePrefix}_model (make_id, model_id, model_name) VALUES `;
                let insertPlaceholders = [];
                for (let i=0; i < data.length; i++) {

                    insertPlaceholders.push( `(?,?,?)`)
                    insertData.push(data[i]['Make_ID']);
                    insertData.push(data[i]['Model_ID']);
                    insertData.push(data[i]['Model_Name']);


                    if( (i+1) % batchSize == 0){
                        // Run the batch
                        sqlInsert = sqlInsert + insertPlaceholders.join(", ");
                        let [rows, fields] = await db.execute(sqlInsert, insertData);


                        // Reset the Data
                        insertData = [];
                        insertPlaceholders=[];
                        sqlInsert = `REPLACE INTO ${tablePrefix}_model (make_id, model_id, model_name) VALUES `;
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

                logger.info("Downloaded Model data from NHTSA. Finished Import");

            }


        }
    }




    // Get all the models for the requested makes
    sql = "SELECT Mo.Make_ID, Ma.Make_Name, Mo.Model_ID, Mo.Model_Name FROM " + tablePrefix + "_model Mo LEFT JOIN " + tablePrefix + "_make Ma ON Mo.Make_ID = Ma.Make_ID WHERE Ma.make_id IN ("+makesRequestedFilteredString+")  ORDER BY Ma.Make_ID ASC, Mo.Model_Name ASC";

    let [modelRows]  = await db.query(sql)

    let responseRows = [];

    for(let r=0; r < modelRows.length; r++){
        responseRows.push(modelRows[r]);
    }

    // Return data
    return responseRows;

}
