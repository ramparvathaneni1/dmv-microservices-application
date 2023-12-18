import express from 'express';

const vMake = express.Router();

vMake.post('/get', async function (req, res) {
    req.service.logger.info("GET: Make")
    // Get the data
    let makeData = await req.service.module.getMake(req.service);

    let message = "Response returned successfully";

    if(!makeData){
        message = "Invalid make requests";
    }

    let response = {
        "Count": makeData.length,
        "Message": message,
        "SearchCriteria": null,
        "Results": makeData
    }

    let httpStatus = 401;
    if(makeData.length > 0){
        httpStatus = 200;
    }

    return res.status(httpStatus).send(response);
});

export default vMake;