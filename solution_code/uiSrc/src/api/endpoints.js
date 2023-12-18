import axios from "axios";
const url = `http://${process.env.REACT_APP_host_driver}/api/driver/get`;
const driverUpdate = `http://${process.env.REACT_APP_host_driver}/api/driver/update/`;
const driverAdd = `http://${process.env.REACT_APP_host_driver}/api/driver/add/`;
const plateUrl = `http://${process.env.REACT_APP_host_plate}/api/plate/get`;
const plateAddUrl = `http://${process.env.REACT_APP_host_plate}/api/plate/add`;
const vehicleUrl = `http://${process.env.REACT_APP_host_vehicle}/api/vehicle/make/get`;
const vehicleModelUrl = `http://${process.env.REACT_APP_host_vehicle}/api/vehicle/model/get`;
const vehicleMakelUrl = `http://${process.env.REACT_APP_host_vehicle}/api/vehicle/make/get`;
const vehicleUrl1 = `localhost:3001/api/vehicle/make/get`;


let makeModelCache = {};
const defaultDriverinfo = {
  sort: [
    {
      last_name: "acs",
    },
  ],
  limit: {
    skip: 0,
    numberPerPage: 100,
  },
};


export const AddDriver = async (driver) => {
  let driverupdates = await axios.post(driverAdd, driver);
  return driverupdates.data.Results.id;
};

export const updateDriver = async (newDriverData) => {
  let driverupdates = await axios.post(driverUpdate, {
    Action: "UPDATE",
    Driver: newDriverData,
  });
};

export const deleteDriver = async (driverData) => {
  let driverupdates = await axios.post(driverUpdate, {
    Action: "DELETE",
    Driver: {
      id: driverData,
    },
  });
}

export const getDriver = async (driverIds = defaultDriverinfo) => {
  const url = `http://${process.env.REACT_APP_host_driver}/api/driver/list`;
  let axiosResults = await axios
    .post(url, driverIds)
    .then((res) => {
      const listing = res.data;

      return listing;
    })
    .catch(function (error) {});
  return axiosResults;
};

export const getPlates = async (plates) => {
  // Get the plates that apply to the driver
  const info = {
    driver_ids: [parseInt(plates)],
  };

  let plateResults = await axios
    .post(plateUrl, info)
    .then((res) => {
      const listing = res.data;
      return listing;
    })
    .catch(function (error) {});
  return plateResults;
};

export const addPlate = async (plateData) => {

console.log(plateData)
let plateAddition = await axios.post(plateAddUrl, plateData).then(response =>{
  // Success
  return [true,response.data.Results.id,"Success"]
  
}).catch(error =>{
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return [false,0,error.response.data.Message];
})

return plateAddition;
}

export const getModel = async (model) => {
  const vehicleModel = await axios.post(vehicleModelUrl, {
    Make_ID: [parseInt(model)],
  });
  return vehicleModel.data.Results;
};

export const getMakes = async () => {
  const vehicleMakes = await axios.post(vehicleMakelUrl);
  const slicedVehicles = vehicleMakes.data.Results.splice(0, 30);
  return slicedVehicles.reverse();
};
export const getIndividualDriver = async (driverIds) => {
  const driverListing = driverIds.split(",").map(Number);

  const info = {
    driver_ids: driverListing,
  };

  // Get the driver information
  let axiosResults = await axios
    .post(url, info)
    .then((res) => {
      const listing = res.data;
      return listing;
    })
    .catch(function (error) {
      
      //console.log(error);
    });
  // Get the plates that apply to the driver
  let plateResults = await axios
    .post(plateUrl, info)
    .then((res) => {
      const listing = res.data;
      return listing.Results;
    })
    .catch(function (error) {
      //console.log(error);
    });

  //Bringing up the plate details

  // Build the driver's plate list

  let driverData = axiosResults.Results;
  // For each driver in the plate results
  for (const driverID in plateResults) {
    // What is the array index of driverID in driverData?
    const driverDataIndex = findWithAttr(driverData, "id", driverID);

    // Create the platelist for one driver
    driverData[driverDataIndex].plates = [];

    // For each plate that a driver has
    for (let p = 0; p < plateResults[driverID].length; p++) {
      let onePlate = plateResults[driverID][p];

      let vehicleType = await getMakeModelText([
        onePlate.Make_Id,
        onePlate.Model_Id,
      ]);

      onePlate.Model_Name = vehicleType[1];
      onePlate.Make_Name = vehicleType[0];
      driverData[driverDataIndex]["plates"].push(onePlate);
    }
  }
  return driverData;
};

export const getMakeModelText = async (Make_ID, Model_ID) => {
  // Parse the requested make ID
  const requestedMake_ID = parseInt(Make_ID);

  let vehicleResults;

  // Is it in cache
  if (!makeModelCache.hasOwnProperty(requestedMake_ID)) {
    // Create the cache for the make
    makeModelCache[requestedMake_ID] = {
      Make_ID: requestedMake_ID,
      Models: {},
    };

    // It is not in cache and request from API
    const vehicleResultsReq = await axios.post(vehicleModelUrl, {
      Make_ID: [requestedMake_ID],
    });

    // Loop through results and build a data object in memory
    for (let i = 0; i < vehicleResultsReq.data["Results"].length; i++) {
      let oneResult = vehicleResultsReq.data["Results"][i];
      makeModelCache[oneResult.Make_ID]["Make_Name"] = oneResult.Make_Name;
      makeModelCache[oneResult.Make_ID]["Models"][oneResult.Model_ID] =
        oneResult;
    }
  }

  // The make was found in the API and populated
  if (typeof makeModelCache[requestedMake_ID] != "undefined") {
    vehicleResults = makeModelCache[requestedMake_ID];
  } else {
    return ["Unknown", "Unknown"];
  }

  if (
    typeof vehicleResults.hasOwnProperty("Models") &&
    vehicleResults["Models"].hasOwnProperty(Model_ID)
  ) {
    // The model has been found
    return [
      vehicleResults["Make_Name"],
      vehicleResults["Models"][Model_ID]["Model_Name"],
    ];
  } else {
    // Make found but not model found
    return [vehicleResults["Make_Name"], "Unknown"];
  }
};

function findWithAttr(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] == value) {
      return i;
    }
  }
  return -1;
}
