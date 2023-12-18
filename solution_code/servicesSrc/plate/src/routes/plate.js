import express from 'express';
import mapObject from 'map-obj';

const allowedUpdateActions = ['update','delete'];

const vPlate = express.Router();

vPlate.post('/get',async function (req, res) {
    req.service.logger.info("ROUTE: Plate API /plate/get")

    // Set up basic response
    let httpStatus = 401;
    let response = {
        "Count": 0,
        "Message": '',
        "SearchCriteria": null,
        "Results": null
    }

    // If req.body missing return error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        response.Message = "No Request Submitted"
        return res.status(httpStatus).send(response);
    }

    const requestObj = mapObject(req.body, (key, value) => [key.toLowerCase(), value], {deep: true});

    // Get the data
    if(!requestObj.hasOwnProperty('driver_ids') || !Array.isArray(requestObj.driver_ids)){
        response.Message = "No Driver ID's submitted or invalid submission"
        return res.status(httpStatus).send(response);
    }

    let plateData = await await req.service.module.getByDriverIds(requestObj.driver_ids, req.service);

    let message = "Response returned successfully";

    if(!plateData){
        message = "Invalid make requests";
    }

    // Count the returned records
    let counter = 0;
    for(const driver in plateData){
        counter += plateData[driver]?.length;
    }

    // Build the Response
    response = {
        "Count": counter,
        "Message": message,
        "SearchCriteria": null,
        "Results": plateData
    }

    if(counter >= 0){
        httpStatus = 200;
    }

    return res.status(httpStatus).send(response);

});

vPlate.post('/update',async function (req, res){
    req.service.logger.info("ROUTE: Plate API /plate/update")

    // Set up basic response
    let httpStatus = 401;
    let response = {
        "Count": 0,
        "Message": '',
        "SearchCriteria": null,
        "Results": null
    }

    // If req.body missing return error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        response.Message = "No Request Submitted"
        return res.status(httpStatus).send(response);
    }

    const requestObj = mapObject(req.body, (key, value) => [key?.toLowerCase(), value], {deep: true});


    // Validate that action is present in body
    if (!requestObj.hasOwnProperty('action')) {
        response.Message = "No Action Submitted"
        return res.status(httpStatus).send(response);
    }


    const action = requestObj.action.toLowerCase();
    if(allowedUpdateActions.indexOf(action) == -1){
        response.Message = "Invalid Action Submitted"
        return res.status(httpStatus).send(response);
    }


    // Validate that plate is present
    if (!requestObj.hasOwnProperty('plate')) {
        response.Message = "Missing Plate Information"
        return res.status(httpStatus).send(response);
    }

    // Require ID on deletes
    if(action.toLowerCase() == "delete"){
        if(!requestObj.plate.hasOwnProperty('id') || isNaN(parseInt(requestObj.plate.id))){
            response.Message = "Missing Plate ID"
            return res.status(httpStatus).send(response);
        }
    }

    let plate_information = requestObj.plate;
    
    let validationResponse = [true]

    // Validate the request if it is an update
    if(action.toLowerCase() != "delete"){
        validationResponse = await req.service.module.validatePlate({
            plate_information,
            checkIfExists: true }, req.service);
    }

    if(validationResponse[0]==false){
        response.Message = validationResponse[1];
        return res.status(httpStatus).send(response);
    }



    // Run update or delete command
    let recordsAffected = 0;
    if(action == "delete"){
        // Delete Scenario
        recordsAffected = await req.service.module.remove(plate_information.id, req.service);
    }else{

        // Update / Create Scenario
        recordsAffected = await req.service.module.update(plate_information, req.service)
    }

    let message = "Response returned successfully";

    // If records affected count < 1 return error
    if(recordsAffected < 1){
        req.service.logger.error("ROUTE: Plate API /plate/update FAILED")
        message = `${action} failed`
    }else{
        req.service.logger.info("ROUTE: Plate API /plate/update SUCCESS")
        httpStatus = 200;
    }

    response = {
        "Count": recordsAffected,
        "Message": message,
        "SearchCriteria": null,
        "Results": ""
    }


    return res.status(httpStatus).send(response);

})

vPlate.post('/add',async function (req, res){
    req.service.logger.info("ROUTE: Plate API /plate/add")

    // Set up basic response
    let httpStatus = 401;
    let response = {
        "Count": 0,
        "Message": '',
        "SearchCriteria": null,
        "Results": null
    }

    // If req.body missing return error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        response.Message = "No Request Submitted"
        return res.status(httpStatus).send(response);
    }

    const requestObj = mapObject(req.body, (key, value) => [key.toLowerCase(), value], {deep: true});

    // Require ID on deletes
    let plate_information = requestObj;

    req.service.logger.info("PLATE")
    req.service.logger.info(plate_information)

    let validationResponse = await req.service.module.validatePlate({
            plate_information,
            checkIfExists: false }, req.service);

    if(validationResponse[0]==false){
        response.Message = validationResponse[1];
        return res.status(httpStatus).send(response);
    }

    // Run update or delete command
    let results = [0,0]

    // Update / Create Scenario
    results = await req.service.module.add(plate_information, req.service)

    let message = "Response returned successfully";

    // If records affected count < 1 return error
    if(results[0] < 1){
        req.service.logger.error("ROUTE: Plate API /plate/add FAILED")
        if(Message == ''){
            message = `${action} failed`
        }else{
            message = response.Message;
        }
    }else{
        req.service.logger.info("ROUTE: Plate API /plate/add SUCCESS")
        httpStatus = 200;
    }

    response = {
        "Count": results[0],
        "Message": message,
        "SearchCriteria": null,
        "Results": {
            "id":results[1]
        }
    }

    return res.status(httpStatus).send(response);

})



export default vPlate;