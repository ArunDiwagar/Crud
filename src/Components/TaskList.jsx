import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import MyVerticallyCenteredModal from "./UpdateTask";
import ConfirmModal from "./ConfirmModal";  // Import the ConfirmModal component
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTaskFromServer,
  getTaskFromServer,
  removeTaskFromList,
  setSelectedTask,
} from "../Slices/tasksSlice";

const TaskList = () => {
  const dispatch = useDispatch();
  const { taskList } = useSelector((state) => state.task);
  const [modalShow, setModalShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false); // Modal state for confirmation
  const [selectedTask, setSelectedTask] = useState(null); // State to store the task to delete

  const updateTask = (task) => {
    dispatch(setSelectedTask(task)); // Set the selected task
    setModalShow(true);
  };

  useEffect(() => {
    dispatch(getTaskFromServer());
  }, [dispatch]);

  const handleDelete = () => {
    dispatch(deleteTaskFromServer(selectedTask))
      .unwrap()
      .then(() => {
        // Remove the task from the local state
        dispatch(removeTaskFromList(selectedTask));
        setConfirmShow(false); // Close the modal after deleting
      })
      .catch((error) => {
        console.error("Failed to delete task:", error);
        alert(`Failed to delete task: ${error.error}`);
      });
  };

  const deleteTask = (task) => {
    setSelectedTask(task); // Set the selected task for deletion
    setConfirmShow(true);  // Show the confirmation modal
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {taskList &&
            taskList.map((task, index) => (
              <tr className="text-center" key={task.id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <Button
                    variant="primary"
                    className="mx-3"
                    onClick={() => updateTask(task)}
                  >
                    <i className="bi bi-pen-fill"></i>
                  </Button>
                  <Button variant="danger" onClick={() => deleteTask(task)}>
                    <i className="bi bi-trash3"></i>
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      
      {/* Update Task Modal */}
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      {/* Confirm Deletion Modal */}
      <ConfirmModal
        show={confirmShow}
        handleClose={() => setConfirmShow(false)} // Close modal
        handleConfirm={handleDelete}             // Confirm deletion
        task={selectedTask}
      />
    </>
  );
};

export default TaskList;
