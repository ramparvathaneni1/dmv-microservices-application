import express from 'express';
import { driverFieldList } from '../modules/driver.js';
import mapObject from 'map-obj';

const allowedUpdateActions = ['update','delete'];

const vDriver = express.Router();

vDriver.post('/get',async function (req, res) {
    req.service.logger.info("ROUTE: Driver API /driver/get")


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
        response.message = "No Request Submitted"
        return res.status(httpStatus).send(response);
    }

    const requestObj = mapObject(req.body, (key, value) => [key.toLowerCase(), value], {deep: true});

    // Get the data
    if(!requestObj.hasOwnProperty('driver_ids') || !Array.isArray(requestObj.driver_ids)){
        response.message = "No Driver ID's submitted or invalid submission"
        return res.status(httpStatus).send(response);
    }

    let driverData = await req.service.module.get(requestObj.driver_ids, req.service);

    let message = "Response returned successfully";

    if(!driverData){
        message = "Invalid make requests";
    }

    response = {
        "Count": driverData.length,
        "Message": message,
        "SearchCriteria": null,
        "Results": driverData
    }

    if(driverData.length > 0){
        httpStatus = 200;
    }

    return res.status(httpStatus).send(response);
});

vDriver.post('/list',async function (req, res){
    req.service.logger.info("ROUTE: Driver API /driver/list")

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
        response.message = "No Request Submitted"
        return res.status(httpStatus).send(response);
    }

    const requestObj = mapObject(req.body, (key, value) => [key.toLowerCase(), value], {deep: true});

    let sort = [];

    // If request sort present
    if (requestObj.hasOwnProperty('sort') && Array.isArray(requestObj['sort'])){
        // Validate fields and directions (default to asc)
        let allowedDirections = ['asc','desc']

        for(let i=0;i<requestObj.sort.length;i++){
            if(Object.keys(requestObj.sort[i]).length > 0){
                let sortField = Object.keys(requestObj.sort[i])[0].toLowerCase();

                let direction = requestObj.sort[i][sortField].toLowerCase();
                if(allowedDirections.indexOf(direction) < 0){
                    direction = "asc";
                }

                // If valid, add to sorts
                if(driverFieldList.indexOf(sortField) > -1){
                    sort.push([sortField,direction]);
                }
            }
        }
    }

    // If limit present
    let skip = 0;
    let numberPerPage = 10;

    if (requestObj.hasOwnProperty('limit')) {

        // If skip and value is whole number
        if( requestObj.limit.hasOwnProperty('skip') ) {
            skip = parseInt(requestObj.limit.skip);
            if(isNaN(skip) || skip < 0){
               skip = 0;
            }
        }

        // If number of page present and value is > 0
        if( requestObj.limit.hasOwnProperty('numberperpage') ) {
            numberPerPage = parseInt(requestObj.limit.numberperpage);
            if(isNaN(numberPerPage) || numberPerPage < 1){
                numberPerPage = 100;
            }
        }
    }
    
    // Get the driver list from module
    let listData = await req.service.module.getList(sort,[skip,numberPerPage], req.service);

    let message = "Response returned successfully";

    if(!listData){
        message = "Invalid make requests";
    }

    response = {
        "Count": listData.length,
        "Message": message,
        "SearchCriteria": null,
        "Results": listData
    }

    httpStatus = 200;

    return res.status(httpStatus).send(response);
})

vDriver.post('/update',async function (req, res){
    req.service.logger.info("ROUTE: Driver API /driver/update")

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
        response.message = "No Request Submitted"
        return res.status(httpStatus).send(response);
    }

    const requestObj = mapObject(req.body, (key, value) => [key.toLowerCase(), value], {deep: true});

    // Validate that action is present in body
    if (!requestObj.hasOwnProperty('action')) {
        response.message = "No Action Submitted"
        return res.status(httpStatus).send(response);
    }
    
    const action = requestObj.action.toLowerCase();
    if(allowedUpdateActions.indexOf(action) == -1){
        response.message = "Invalid Action Submitted"
        return res.status(httpStatus).send(response);
    }

    // Validate that driver is present in body
    // Validate that ID is present

    if (!requestObj.hasOwnProperty('driver') || !requestObj.driver.hasOwnProperty('id') || isNaN(parseInt(requestObj.driver.id))) {
        response.message = "Missing Driver or ID"
        return res.status(httpStatus).send(response);
        }

    let driver_information = requestObj.driver;
    driver_information.id = parseInt(requestObj.driver.id);

    // Run update or delete command
    let recordsAffected = 0;
    if(action == "delete"){
        // Delete Scenario
        recordsAffected = await req.service.module.remove(driver_information.id, req.service);
    }else{
        // Update Scenario
        recordsAffected = await req.service.module.update(driver_information, req.service)
    }

    let message = "Response returned successfully";

    // If records affected count < 1 return error
    if(recordsAffected < 1){
        req.service.logger.error("ROUTE: Driver API /driver/add FAILED")
        let message = `${action} failed`
    }else{
        req.service.logger.info("ROUTE: Driver API /driver/add SUCCESS")
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

vDriver.post('/add',async function (req, res){
    req.service.logger.info("ROUTE: Driver API /driver/add")

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
        response.message = "No Request Submitted"
        return res.status(httpStatus).send(response);
    }

    const requestObj = mapObject(req.body, (key, value) => [key.toLowerCase(), value], {deep: true});

    let driver_information = requestObj;

    // Run update or delete command
    let results = [0,0]

    results = await req.service.module.add(driver_information, req.service);

    let message = "Response returned successfully";

    // If records affected count < 1 return error
    if(results[0] < 1){
        req.service.logger.error("ROUTE: Driver API /driver/add FAILED")
        let message = `${action} failed`
    }else{
        req.service.logger.info("ROUTE: Driver API /driver/add SUCCESS")
        httpStatus = 200;
    }

    response = {
        "Count": results[0],
        "Message": message,
        "SearchCriteria": null,
        "Results": {"id":results[1]}
    }

    return res.status(httpStatus).send(response);

})


export default vDriver;