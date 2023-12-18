import express from 'express';

const vModel = express.Router();

vModel.post('/get',async function (req, res) {
    req.service.logger.info("GET: Model")
    // Get the data

    // NOTE: The commented out line below is for demonstration purposes for our 'how not to write a unit test' example in app.test.js
    //let modelData = await getModels(req.body.Make_ID, req.service);
    
    let modelData = await req.service.module.getModels(req.body.Make_ID, req.service);

    let response = {
        "Count": modelData.length,
        "Message": "Response returned successfully",
        "SearchCriteria": null,
        "Results": modelData
    }

    let httpStatus = 401;
    if(modelData.length > 0){
        httpStatus = 200;
    }

    return res.status(httpStatus).send(response);

});

export default vModel;