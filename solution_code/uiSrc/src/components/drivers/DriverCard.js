import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import profileImage from "../../images/person-circle.svg";
export const DriverCard = ({
  first_name,
  last_name,
  licenseNumber,
  street,
  city,
  state,
  id,
}) => (
  <Card style={{}}>
    <div className="head-card">
      <Card.Img variant="top" src={profileImage} />
    </div>
    <Card.Body>
      <Card.Title>
        {" "}
        First name: <span>{first_name}</span> Last name:{" "}
        <span>{last_name}</span>
      </Card.Title>

      <div className="Col">
        {" "}
        <address>
          {street} <br />
          {city}, {state} <br />
        </address>
      </div>
      <p>
        License number: <span>{licenseNumber}</span>
      </p>
      <Link to={`/driver/edit/${id}`}>
        <Button variant="primary">Edit</Button>
      </Link>
    </Card.Body>
  </Card>
);
