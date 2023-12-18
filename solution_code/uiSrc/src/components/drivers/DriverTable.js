import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { getDriver, deleteDriver } from "../../api/endpoints";

export function DriverTable() {
  const [data, setData] = useState({});

  const [page, setpage] = useState(1);
  const [skipNumber, setskipNumber] = useState(0);
  const [firstName, setFirstName] = useState("desc");
  const [lastName, setLastName] = useState("asc");
  let sorting = {
    sort: [
      {
        last_name: lastName,
      },
      {
        first_name: firstName,
      },
    ],
    limit: {
      skip: skipNumber,
      numberPerPage: 100,
    },
  };

  const retrieveData = async () => {
    let info = await getDriver();
    setData(info);
  };

  useEffect(() => {
    let newSkipNumber = (page - 1) * 100;
    setskipNumber(newSkipNumber);
  }, [page]);

  useEffect(() => {
    async function updateTheData() {
      let updatedList = await getDriver(sorting);
      setData(updatedList);
    }
    updateTheData();
  }, [skipNumber]);

  const addsubPages = (info) => {
    // If previous
    if (info == "prev") {
      let newPage = page - 1;

      // Prevent pages from going negative
      if (newPage < 1) {
        newPage = 1;
      }
      // Set the desired page number
      setpage(newPage);
    } else {
      let newPage = page + 1;
      setpage(newPage);
    }
  };

  const pagination = async (entry) => {
    addsubPages(entry);
    let updatedList = await getDriver(sorting);
    setData(updatedList);
  };

  const deleteTheDriver = async (driverId) => {
    const deletedDriver = await deleteDriver(driverId);
    retrieveData();
  };
  useEffect(() => {
    if (Object.keys(data).length === 0) {
      retrieveData();
    }
  });
  return (
    <div>
      <div className="row mb-4">
        <div className="col">
          <h1>Listing of drivers</h1>
        </div>
        <div className="col d-flex flex-row-reverse">
          {" "}
          <ButtonGroup aria-label="Pagination">
            {page == 1 ? (
              <Button variant="secondary" disabled>
                Previous
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={(value) => pagination("prev")}
              >
                Previous
              </Button>
            )}

            {data.Count < 100 ? (
              <Button variant="secondary" disabled>
                Next
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={(value) => pagination("next")}
              >
                Next
              </Button>
            )}
          </ButtonGroup>
        </div>
      </div>
      <hr></hr>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>State</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.Results
            ? data.Results.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/driver/${item.id}`}>
                      {" "}
                      {item.last_name} {item.first_name}
                    </Link>
                  </td>
                  <td>{item.email}</td>
                  <td>{item.state}</td>
                  <td>
                    <Button onClick={(value) => deleteTheDriver(item.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            : "Loading"}
        </tbody>
      </Table>
    </div>
  );
}
