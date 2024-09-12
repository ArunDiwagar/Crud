import React from "react";
import Navbar from "./Components/Navbar";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AddTask from "./Components/AddTask";
import { Container, Row ,Col} from "react-bootstrap";
import TaskList from "./Components/TaskList";

function App() {
  return (
    <>
      <Container>
        <Navbar />
        <Row className="justify-content-md-center">
          <Col lg="6">
            <AddTask />
            <TaskList/>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
