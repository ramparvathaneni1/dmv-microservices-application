import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DriverEdit } from "./components/drivers/DriverEdit";
import { DriverInfo } from "./components/drivers/DriverInfo";
import { DriverAddForm } from "./components/drivers/DriverAddForm";
import { PlateAdd } from "./components/plates/PlateAdd";
import { Navbar } from "./components/common/Navbar";
import "./styles/main.scss";
import { DriverTable } from "./components/drivers/DriverTable";
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="container pb-5 pt-5">
          <Routes>
            <Route path="/" exact element={<DriverTable />} />
            <Route path="/driver" exact element={<DriverTable />} />
            <Route path="/drivers" exact element={<DriverTable />} />
            <Route path="/driver/:id" element={<DriverInfo />} />
            <Route path="/driver/edit/:id" element={<DriverEdit />} />
            <Route path="/driver/add" element={<DriverAddForm />} />
            <Route path="/plate/:id/add" element={<PlateAdd />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
