import config from "config";
import axios from "axios";
import mapObject from 'map-obj';

const tablePrefix = config.get("database.prefix");
const driverAPI = config.get("driverAPI.uri");
const vehicleAPI = config.get("vehicleAPI.uri");


export const plateFieldList = ['id', 'vin','make_id','model_id','platetext','driver_id'];

// Used to validate a plate request
export async function validatePlate({plate_information, checkIfExists}, {logger, db}) {

    plate_information = mapObject(plate_information, (key, value) => [key.toLowerCase(), value], {deep: true});

    // Ensure that mandatory fields are present
    if(
        !plate_information.hasOwnProperty('make_id') || 
        !plate_information.hasOwnProperty('model_id') || 
        !plate_information.hasOwnProperty('platetext') || 
        !plate_information.hasOwnProperty('driver_id')){
        return [false,"Missing required fields"];
    }

    // Validate the Data
    if(plate_information.hasOwnProperty('id')){
        // Existing Plate

        // Plate must not exist on another ID
        let validateSQL = `SELECT id FROM ${tablePrefix}_plates WHERE id != ? and plateText = ?`;
        let insertData = [plate_information.id,plate_information.platetext];
        let [rows] = await db.execute(validateSQL, insertData);
        if(rows.length > 0 && !checkIfExists){
            // Plate is already assigned to different ID
            return [false,"Plate Already Exists"];
        }
    }else{
        // New Plate

        // Plate must not exist on another ID
        let validateSQL = `SELECT id FROM ${tablePrefix}_plates WHERE plateText = ?`;
        let insertData = [plate_information.platetext];
        let [rows] = await db.execute(validateSQL, insertData);
        if(rows.length > 0){
            // Plate is already assigned to different ID
            return [false,"Plate Already Exists"];
        }

    }

    // Make must exist
    const makeURL = vehicleAPI + "api/vehicle/make/get";
    let makeData = await axios.post(makeURL).catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          logger.error("Axios Error: " + makeURL);

        }
      });
      let makes = [];
      for(let i=0; i<makeData.data.Results.length; i++){
        makes.push(makeData.data.Results[i]['make_id']);
        }
        if(makes.indexOf(parseInt(plate_information.make_id)) < 0){
            return [false,"Model does not match to known model_id"];
        }


    // Model_id must exist
    const modelURL = vehicleAPI + "api/vehicle/model/get";
    const reqData = {"Make_ID":[Number(plate_information.make_id)]};
    let modelData = await axios.post(modelURL,reqData).catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          logger.error("Axios Error: " + modelURL);

        }
      });
    let models = [];
    for(let i=0; i<modelData.data.Results.length; i++){
        models.push(modelData.data.Results[i]['Model_ID']);
    }

    if(models.indexOf(plate_information.model_id) < 0){
        return [false,"Model does not match to known model_id"];
    }


    // Driver must exist
    let driverAPIRequestPath = driverAPI + "api/driver/get";

    let driverData = await axios.post(driverAPIRequestPath,{"driver_ids":[plate_information.driver_id]}).catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          logger.error("Axios Error: " + driverAPIRequestPath);

        }
      });

    if(driverData.data.Count < 1){
        return [false,"Driver not fount"];
    }

    // Note: If this were a 'production' system, the VIN would be validated
    // and the make derived from VIN where possible. This is being omitted to
    // avoid requiring commercial VIN validation API's

    // No validations have failed
    return [true,""];
}

export async function getByDriverIds(driver_ids, {logger, db}){

    // Convert driver ID's into clean sql input
    driver_ids = driver_ids.filter(element => typeof element === 'number');
    let driver_ids_sanitized = driver_ids.join(',');

    if(driver_ids_sanitized.length < 1){
        return [];
    }

    const sql = `SELECT * FROM ${tablePrefix}_plates WHERE driver_id IN (${driver_ids_sanitized})`;

    let [rows] = await db.query(sql);

    // Build Results array of objects
    let results = {};

    for(let i=0;i<rows.length;i++){
        if(!results.hasOwnProperty(rows[i]['driver_id'])){
            results[rows[i]['driver_id']]=[];
        }
        results[rows[i]['driver_id']].push(rows[i]);
    }

    // Return results

    return results;

}

export async function getByPlateIds(plate_ids, {logger, db}){

    // Convert driver ID's into clean sql input
    plate_ids = plate_ids.filter(element => typeof element === 'number');
    let plate_ids_sanitized = plate_ids.join(',');

    if(plate_ids_sanitized.length < 1){
        return [];
    }

    const sql = `SELECT * FROM ${tablePrefix}_plates WHERE id IN (${plate_ids_sanitized})`;

    let [rows] = await db.query(sql);

    // Return results
    return rows;
}

export async function update(plate_information, {logger, db}){


    // Check for driver ID
    if(!plate_information.hasOwnProperty('id') && plate_information.hasOwnProperty('plateText')){
        // If none found, return no records updated
        return 0;
    }

    let sql = `REPLACE INTO ${tablePrefix}_plates  `;

    // Create the update statements

    let updateDataArr = [];
    let fieldSet = [];
    let placeHolderSet = [];

    // For each property of driver
    for (const [key, value] of Object.entries(plate_information)) {
        let mKey = key.toLowerCase();

        // Is a valid field (and not id)
        if(plateFieldList.indexOf(mKey) > -1){
            // Add to update data array
            fieldSet.push(mKey);
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
    let [results] = await db.execute(sql, updateDataArr);
    // If successful, return affected records, else 0
    return results.affectedRows;
}

export async function add(plate_information, {logger, db}){

    // Check for driver ID
    if(plate_information.hasOwnProperty('plateText')){
        // If none found, return no records updated
        return 0;
    }

    let sql = `INSERT INTO ${tablePrefix}_plates  `;

    // Create the update statements

    let updateDataArr = [];
    let fieldSet = [];
    let placeHolderSet = [];

    // For each property of driver
    for (const [key, value] of Object.entries(plate_information)) {
        let mKey = key.toLowerCase();

        // Is a valid field (and not id)
        if(plateFieldList.indexOf(mKey) > -1){
            // Add to update data array
            fieldSet.push(mKey);
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
    let results = await db.execute(sql, updateDataArr);
    // If successful, return affected records, else 0
    return [results[0].affectedRows,results[0].insertId];
}

export async function remove(plate_id, {logger, db}){

    // Validate requested id
    if(typeof plate_id == "undefined" || isNaN(parseInt(plate_id))){
        // If none found, return no records updated
        return 0;
    }

    // Get plate to remove
    let plateID = parseInt(plate_id);
    let plate = await getByPlateIds([plateID], {logger, db})

    // If driver exists
    if(plate.length > 0) {
        let sql = `DELETE FROM ${tablePrefix}_plates WHERE id = ?`;
        let result = await db.execute(sql, [plateID]);
        // If successful, return affected records, else 0
        return result[0].affectedRows;
    } else {
        return 0;
    }
}
