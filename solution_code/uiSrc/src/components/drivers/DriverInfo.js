import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getIndividualDriver } from "../../api/endpoints";
import { DriverCard } from "./DriverCard";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Table from 'react-bootstrap/Table';


export function DriverInfo() {
  const [driversData, setdriversData] = useState([]);
  let { id } = useParams();
  
  const retrieveData = async () => {
    let retrievedData = await getIndividualDriver(id);
    setdriversData([...retrievedData]);
  };

  useEffect(() => {
    retrieveData();
  }, []);

  return (
    <div>
      {driversData.length > 0 ? (
        <div>
          <div className="col d-flex flex-row-reverse mb-4">
            <Link to={`/drivers`}>
              <Button>Back to drivers</Button>
            </Link>
          </div>{" "}
          {driversData.map((item) => (
            <div>
              <DriverCard {...item} className="mb-3"></DriverCard>
              <h2 className="mt-5"> Driver plates</h2>
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
                {item.plates && item.plates.length > 0 ? (
                  item.plates.map((plate) => (
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
              <Link to={`/plate/${id}/add`}>
                <Button className="mt-3">Add a plate</Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>
          <Spinner animation="border" size="lg" /> Loading
        </p>
      )}
    </div>
  );
}
