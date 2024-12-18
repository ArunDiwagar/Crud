import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useDispatch } from "react-redux";
import { addTaskToServer } from "../Slices/tasksSlice";

const AddTask = () => {
  const dispatch = useDispatch();
  
  // State variables for task title and description
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // State variables for error messages
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // Function to validate inputs and add the task
  const addTask = (e) => {
    e.preventDefault();
    
    // Resetting the error messages
    setTitleError("");
    setDescriptionError("");
    
    // Input validation
    let isValid = true;
    if (title.trim() === "") {
      setTitleError("Task title is required.");
      isValid = false;
    }
    if (description.trim() === "") {
      setDescriptionError("Task description is required.");
      isValid = false;
    }

    // If all inputs are valid, dispatch the addTaskToServer action
    if (isValid) {
      dispatch(addTaskToServer({ title, description }));
      setTitle("");
      setDescription("");
    }
  };

  return (
    <section className="my-5">
      <Form onSubmit={addTask}>
        {/* Task title input */}
        <Form.Group className="mb-3" controlId="formTaskTitle">
          <Form.Label>Task Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            isInvalid={!!titleError} // Bootstrap validation style
          />
          {/* Display error message if title is invalid */}
          {titleError && <Alert variant="danger">{titleError}</Alert>}
        </Form.Group>

        {/* Task description input */}
        <Form.Group className="mb-3" controlId="formTaskDescription">
          <Form.Label>Task Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            isInvalid={!!descriptionError} // Bootstrap validation style
          />
          {/* Display error message if description is invalid */}
          {descriptionError && <Alert variant="danger">{descriptionError}</Alert>}
        </Form.Group>

        {/* Add Task button */}
        <div className="text-end">
          <Button variant="primary" type="submit">
            Add Task
          </Button>
        </div>
      </Form>
    </section>
  );
};

export default AddTask;
