import config from "config";
import axios from "axios";

const tablePrefix = config.get("database.prefix");
const plateAPI = config.get("plateAPI.uri");


export const driverFieldList = ['id', 'first_name','last_name','email','street','city','state','licensenumber','licenseexpire'];

export async function getList(sort,pagination, {logger, db}){

    let sql = `SELECT * FROM ${tablePrefix}_driver`;

    // Add the sorts
    if(sort.length > 0){
        let sortKeys = [];

        for(let i=0;i<sort.length;i++){
            if(sort[i].length == 2){
                let sortKey = sort[i][0].toLowerCase();
                if(driverFieldList.indexOf(sortKey) > -1){
                    let sortDirection = "asc";
                    if(sort[i][1].toLowerCase()=="desc"){
                        sortDirection = "desc";
                    }
                    sortKeys.push( sortKey  + " " + sortDirection);

                }
            }
        }
        if(sortKeys.length > 0){
            sql += " ORDER BY " + sortKeys.join(", ") + " ";
        }
    }

    if(pagination.length == 2){
        let start = 0;
        let end = 100;
        if(!isNaN(parseInt(pagination[0]))){
            start = parseInt(pagination[0]);
        }
        if(!isNaN(parseInt(pagination[1])) && parseInt(pagination[1]) > 0){
            end = parseInt(pagination[1]);
        }
        sql += " LIMIT " + start + "," + end;
    }

    let [rows]  = await db.query(sql);

    // Build Results array of objects
    let results = [];

    for(let i=0;i<rows.length;i++){
        results.push(rows[i]);
    }

    // Return results
    return results;
}

export async function get(driver_ids, {logger, db}){

    // Convert driver ID's into clean sql input
    driver_ids = driver_ids.filter(element => typeof element === 'number');
    let driver_ids_sanitized = driver_ids.join(',');

    if(driver_ids_sanitized.length < 1){
        return [];
    }

    const sql = `SELECT * FROM ${tablePrefix}_driver WHERE id IN (${driver_ids_sanitized})`;

    let [rows] = await db.query(sql);

    // Build Results array of objects
    let results = [];

    for(let i=0;i<rows.length;i++){
        results.push(rows[i]);
    }

    // Return results

    return results;

}

export async function update(driver_information, {logger, db}){

    // Check for driver ID
    if(!driver_information.hasOwnProperty('id')){
        // If none found, return no records updated
        return 0;
    }

    let sql = `REPLACE INTO ${tablePrefix}_driver  `;

    // Create the update statements

        let updateDataArr = [driver_information.id];
        let fieldSet = ['id'];
        let placeHolderSet = ['?'];

        // For each property of driver
        for (const [key, value] of Object.entries(driver_information)) {
            let mkey = key.toLowerCase();
            // Is a valid field (and not id)
            if(mkey != "id" && driverFieldList.indexOf(mkey) > -1){
                // Add to update data array
                fieldSet.push(mkey);
                updateDataArr.push(value);
                placeHolderSet.push('?');
            }
        }

        // Verify that there is at least one field to update

        if(updateDataArr.length < 1){
            return 0;
        }

    // Assemble SQL
    sql += " (" + fieldSet.join(",") + ") VALUES (" + placeHolderSet.join(",") + ")";

    // Run update
    let result = await db.execute(sql, updateDataArr);

    // If successful, return affected records, else 0
    return result.affectedRows;
}

export async function add(driver_information, {logger, db}){
    logger.info(driver_information);
    let sql = `INSERT INTO ${tablePrefix}_driver  `;

    // Create the update statements

    let updateDataArr = [];
    let fieldSet = [];
    let placeHolderSet = [];

    // For each property of driver
    for (const [key, value] of Object.entries(driver_information)) {
        let mkey = key.toLowerCase();
        // Is a valid field (and not id)
        if(mkey != "id" && driverFieldList.indexOf(mkey) > -1){
            // Add to update data array
            fieldSet.push(mkey);
            updateDataArr.push(value);
            placeHolderSet.push('?');
        }
    }

    // Verify that there is at least one field to update

    if(updateDataArr.length < 1){
        return [0,0];
    }

    // Assemble SQL
    sql += " (" + fieldSet.join(",") + ") VALUES (" + placeHolderSet.join(",") + ")";

    // Run update
    let result = await db.execute(sql, updateDataArr);

    // If successful, return affected records, else 0
    return [result[0].affectedRows,result[0].insertId];
}


export async function remove(driver_id, {logger, db}){

    // Validate requested id
    if(typeof driver_id == "undefined" || isNaN(parseInt(driver_id))){
        // If none found, return no records updated
        return 0;
    }

    // Get driver to remove
    let driverID = parseInt(driver_id);
    let driver = await get([driver_id], {logger, db})

    // If driver exists
    if(driver.length > 0){
        // Get plates for driver
            let plateAPIRequestPath = plateAPI + "api/plate/get";
            let plateAPIUpdatePath = plateAPI + "api/plate/update";
            let plateAPIAddPath = plateAPI + "api/plate/add";

            const plateData = await axios.post(plateAPIRequestPath,{"driver_ids":[driverID]}).catch(function (error) {
                if (error.response) {
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                  logger.error("Axios Error: " + plateAPIRequestPath);

                }
              });

            let plateList = [];
            if(typeof plateData.data.Results[driverID] != "undefined"){
                plateList = plateData.data.Results[driverID];
            }
            
            let deleteResults = [];

            // Remove plates
            for(let p=0;p<plateList.length;p++){
                let deleteReq = {
                    "Action": "DELETE",
                    "Plate": {
                        "id": plateList[p]['id']
                    }
                }
                console.log(plateAPIUpdatePath);
                console.log(deleteReq);

                deleteResults[p] = await axios.post(plateAPIUpdatePath,deleteReq).catch(function (error) {
                    if (error.response) {
                      console.log(error.response.data);
                      console.log(error.response.status);
                      console.log(error.response.headers);
                      logger.error("Axios Error: " + plateAPIUpdatePath);

                    }
                });
            }

        // Remove driver
        let sql = `DELETE FROM ${tablePrefix}_driver WHERE id = ?`;
        let [result] = await db.execute(sql, [driverID], () => {
            // If remove fails, re-insert plates
            for(let p=0; p < plateList.length; p++ ) {
                let restoreRequest = plateList[p];
                
                console.log(plateAPIAddPath);
                console.log(deleteReq);

                axios.post(plateAPIAddPath,restoreRequest).catch(function (error) {
                    if (error.response) {
                      console.log(error.response.data);
                      console.log(error.response.status);
                      console.log(error.response.headers);
                      logger.error("Axios Error: " + plateAPIAddPath);

                    }
                });
            }

            return 0; 
        })

        // If successful, return affected records, else 0
        return result.affectedRows;

    }else{
        return 0;
    }


}

export default get;