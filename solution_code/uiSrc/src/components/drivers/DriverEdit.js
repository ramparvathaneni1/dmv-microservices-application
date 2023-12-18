import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { getIndividualDriver, updateDriver } from '../../api/endpoints';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export function DriverEdit() {
  const [driversData, setdriversData] = useState({})
  const { id } = useParams(); 
  const navigate = useNavigate();

const updateData = async (data) => {
  data.preventDefault();
let formData = {}
formData.id = driversData[0].id
const inputs = Array.from(data.target);
  inputs.forEach(input => {
    formData[input.id] = input.value
})
updateDriver(formData)
navigate(`/driver/${id}`);


}
  const retrieveData = async () => {
      let retrievedData = await getIndividualDriver(id)
      return setdriversData(retrievedData)
      console.log(retrievedData)
  }

useEffect(() => {
  if(Object.keys(driversData).length === 0){
      retrieveData()
  }
}, [])

  return (
    <div>
      
<h1>Driver Data</h1>
    {driversData[0]? <div>
      <Form onSubmit={(values=>updateData(values))} id="editForm">
      <Form.Group className="mb-3">
        <Form.Label>First Name</Form.Label>
        <Form.Control type="text" placeholder={driversData[0].first_name} defaultValue={driversData[0].first_name} id="first_name"/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Last Name</Form.Label>
        <Form.Control type="text" placeholder={driversData[0].last_name} defaultValue={driversData[0].last_name} id="last_name"/>
      </Form.Group>


      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder={driversData[0].email} defaultValue={driversData[0].email} id="email" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>


      <Form.Group className="mb-3">
        <Form.Label>Street</Form.Label>
        <Form.Control type="text" placeholder={driversData[0].street} defaultValue={driversData[0].street} id="street"/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>City</Form.Label>
        <Form.Control type="text" placeholder={driversData[0].city} defaultValue={driversData[0].city} id="city"/>
      </Form.Group>


      <Form.Group className="mb-3">
        <Form.Label>State</Form.Label>
        <Form.Control type="text" placeholder={driversData[0].state} defaultValue={driversData[0].state} id="state"/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>licenseNumber</Form.Label>
        <Form.Control type="text" placeholder={driversData[0].licenseNumber} defaultValue={driversData[0].licenseNumber} id="licenseNumber"/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>licenseExpire</Form.Label>
        <Form.Control type="text" placeholder={driversData[0].licenseExpire} defaultValue={driversData[0].licenseExpire} id="licenseExpire"/>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>


    </div> : <p>Nothing Available at this time</p>}
    </div>




  )
}
