import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import MyVerticallyCenteredModal from "./UpdateTask";
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

  const updateTask = (task) => {
    dispatch(setSelectedTask(task)); // Set the selected task
    setModalShow(true);
  };

  useEffect(() => {
    dispatch(getTaskFromServer());
  }, [dispatch]);

  const deleteTask = (task) => {
    dispatch(deleteTaskFromServer(task))
      .unwrap()
      .then(() => {
        // Remove the task from the local state
        dispatch(removeTaskFromList(task));
      })
      .catch((error) => {
        console.error("Failed to delete task:", error);
        alert(`Failed to delete task: ${error.error}`);
      });
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
                  <Button variant="primary" onClick={() => deleteTask(task)}>
                    <i className="bi bi-trash3"></i>
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};

export default TaskList;
