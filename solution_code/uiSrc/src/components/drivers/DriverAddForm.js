import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { AddDriver } from "../../api/endpoints";

export function DriverAddForm() {
  const navigate = useNavigate();

  const updateData = async (data) => {
    data.preventDefault();
    let formData = {};
    const inputs = Array.from(data.target);
    inputs.forEach((input) => {
      formData[input.id] = input.value;
    });
    const newinfo = await AddDriver(formData);
    navigate(`/driver/${newinfo}`);
  };
  return (
    <div>
      <h1> Addd a driver</h1>

      <Form onSubmit={(values) => updateData(values)} id="editForm">
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" pplaceholder="First Name" id="first_name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" placeholder="Last Name" id="last_name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="email address" id="email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Street</Form.Label>
          <Form.Control type="text" placeholder="Street" id="street" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" placeholder="city" id="city" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>State</Form.Label>
          <Form.Control type="text" placeholder="state" id="state" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>license Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="license number"
            id="licenseNumber"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>license Expire</Form.Label>
          <Form.Control
            type="text"
            placeholder="license expiration"
            id="licenseExpire"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
