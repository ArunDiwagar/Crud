import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { addTaskToServer } from "../Slices/tasksSlice";

const AddTask = () => {
  const dispatch=useDispatch()
  const [title, setTitle] = useState("");
  const [description, setdescription] = useState("");

  const addTask = (e) => {
    e.preventDefault();
    dispatch(addTaskToServer({title,description}));
    setTitle('')
    setdescription('')
  };

  return (
    <section className="my-5">
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Task title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Task Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Task Description"
          value={description}
          onChange={(e) => setdescription(e.target.value)}
        />
      </Form.Group>
      <div className="text-end">
        <Button variant="primary" type="submit" onClick={(e) => addTask(e)}>
          Add Task
        </Button>
      </div>
    </Form>
    </section>
  );
};

export default AddTask;
