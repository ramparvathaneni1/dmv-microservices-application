import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPlates, getMakes, getModel, addPlate, getMakeModelText } from "../../api/endpoints";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

export function PlateAdd() {
  let { id } = useParams();
  const [plates, setPlates] = useState([]);
  const [makes, setMakes] = useState([]);
  const [model, setModel] = useState([]);
  const [error, seterror] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const updateData = async (event) => {
    event.preventDefault();
    let formData = {};
    seterror(false);
    formData.driver_id = parseInt(id);
    const inputs = Array.from(event.target);

      inputs.forEach(input => {
        formData[input.id] = input.value
    })
    formData.Model_Id = parseInt(formData.Model_Id)
    delete formData[""]
    let plateAdding = await addPlate(formData)
    
    if(plateAdding[0] == false){
      //Error
      console.log("Bad Cow")
      seterror(plateAdding[2])

      setShow(true)
    }else{
      console.log(plateAdding)
      retrievePlatesAndMakes()
    }
}


  const retrievePlatesAndMakes = async () => {
    seterror(false);

    let vehicleMakes = await getMakes();
    setMakes(vehicleMakes);
    let retrievedData = await getPlates(id);

    // Decorate retrievedData with make/model
    for (const driverID in retrievedData.Results) {
      for(let i=0; i < retrievedData.Results[driverID].length; i++){
        let makeModel = await getMakeModelText(Number(retrievedData.Results[driverID][i].Make_Id),Number(retrievedData.Results[driverID][i].Model_Id));
        retrievedData.Results[driverID][i].Make_Name = makeModel[0];
        retrievedData.Results[driverID][i].Model_Name = makeModel[1];
      }
  }

    setPlates(retrievedData);
  };

  const selectMake = async (event) => {
    console.log(event.target.value);
    let models = await getModel(event.target.value);
    setModel(models);
  };

  useEffect(() => {
    if (Object.keys(plates).length === 0) {
      retrievePlatesAndMakes();
    }
  }, []);


  return (
    <div>
      <div className="col d-flex flex-row-reverse mb-4">
        <Link to={`/driver/${id}`}>
          <Button>Back to driver Information</Button>
        </Link>
      </div>{" "}
      <h1>Plates</h1>
      <hr></hr>
      <h2>Listed Plates</h2>
      <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Plate</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>VIN</th>
                </tr>
              </thead>
              <tbody>
              {plates.Count > 0 ? (
          plates.Results[id].map((plate, index) => (
                    <tr>
                      {" "}
                      <td>{plate.plateText}</td>
                      <td>{plate.Make_Name}</td>
                      <td>{plate.Model_Name}</td>
                      <td>{plate.vin}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colspan="4">There's no plates listed</td></tr>
                )}
                </tbody>
              </Table>

      <hr></hr>
      <h2>Add Plate</h2>
      <Form onSubmit={(values) => updateData(values)} id="editForm">
        <Form.Group className="mb-3">
          <Form.Label>Makes</Form.Label>
          <Form.Select
            aria-label="Default Make"
            onChange={(value) => selectMake(value)}
            id="Make_Id"
          >
            <option></option>
            {makes.map((make) => (
              <option value={make.make_id} key={make.make_id} id={make.make_id}>
                {make.make_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Models</Form.Label>
          <Form.Select aria-label="Default Model" id="Model_Id">
            <option></option>
            {model.map((make) => (
              <option
                value={make.Model_ID}
                key={make.Model_ID}
                id={make.Model_ID}
              >
                {make.Model_Name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Plate Text</Form.Label>
          <Form.Control type="text" placeholder="Plate" id="plateText" />
        </Form.Group>



      <Form.Group className="mb-3">
          <Form.Label>Vin</Form.Label>
          <Form.Control type="text" placeholder="Vin" id="vin" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
