// MyVerticallyCenteredModal.jsx
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskInServer } from '../Slices/tasksSlice';

const MyVerticallyCenteredModal = (props) => {
  const { selectedList } = useSelector((state) => state.task); // Use selectedList from state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState(0);

  const dispatch = useDispatch();

  const updateTask = () => {
    props.onHide();
    const task = { id, title, description };
    dispatch(updateTaskInServer(task))
      .unwrap()
      .then(() => {
          console.log('Task updated successfully');
      })
      .catch((error) => {
          alert(`Failed to update task: ${error.error}`);
      });
  };

  useEffect(() => {
    if (Object.keys(selectedList).length !== 0) {
      setTitle(selectedList.title || "");
      setDescription(selectedList.description || "");
      setId(selectedList.id || 0);
    }
  }, [selectedList]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Task
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Task Title</Form.Label>
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
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div className="text-end">
          <Button variant="primary" type="button" onClick={updateTask}>
            Update Task
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default MyVerticallyCenteredModal;
