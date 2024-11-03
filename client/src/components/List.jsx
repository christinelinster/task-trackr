import { useState } from "react";
import("../styles/List.css");

import DeleteIcon from "@mui/icons-material/Delete";
import Radio from "@mui/material/Radio";

function List({
  lists,
  tasks,
  onDeleteList,
  onDeleteTask,
  onUpdateTasks,
  onEditTask,
}) {
  const [addTask, setAddTask] = useState({});
  const [editID, setEditID] = useState(null);
  const [editTask, setEditTask] = useState("");

  function countTasks(listID) {
    let listLength = tasks.filter((task) => task.list_id === listID).length;
    return listLength === 1
      ? `${listLength} task left`
      : `${listLength} tasks left`;
  }

  function handleAddTask(e, listID) {
    setAddTask((prevValue) => ({
      ...prevValue,
      [listID]: e.target.value,
    }));
  }

  async function handleSubmit(e, listID) {
    e.preventDefault();
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addTask: addTask[listID],
          listID: listID,
        }),
      });

      const data = await response.json();
      console.log("New task added", data);
      setAddTask((prevValue) => ({
        ...prevValue,
        [listID]: "",
      }));
      onUpdateTasks();
    } catch (err) {
      console.error("Error adding task", err);
    }
  }

  async function handleEnter(e) {
    if (e.keyCode === 13) {
      try {
        handleOnBlur();
      } catch (err) {
        console.error("Failed to edit task:", err);
      }
    }
  }

  async function handleOnBlur(){
    await onEditTask(editID, editTask)
    setEditID(null)
    setEditTask("");
  }

  function handleEdit(task) {
    setEditID(task.id);
    setEditTask(task.task);
  }

  return (
    <div className="cards">
      {lists.map((list) => (
        <div className="list" key={list.id}>
          <div className="list-title">
            <div>
              <h2>{list.name}</h2>
              <p>{countTasks(list.id)}</p>
            </div>
            <button onClick={() => onDeleteList(list.id)}>
              <DeleteIcon className="icon" />
            </button>
          </div>
          <div className="list-items">
            {tasks
              .filter((task) => task.list_id === list.id)
              .map((task) => (
                <div key={task.id} className="task">
                  <Radio
                    onClick={() => onDeleteTask(task.id)}
                    size="small"
                    sx={{
                      color: "#DED0B6",
                      "&.Mui-checked": {
                        color: "#DED0B6",
                      },
                    }}
                  />
                  {editID === task.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}
                      onKeyDown={(e) => handleEnter(e)}
                      onBlur={(e) => handleOnBlur(e)}
                    />
                  ) : (
                    <p onClick={() => handleEdit(task)}>{task.task}</p>
                  )}
                </div>
              ))}

            <form
              className="add-task"
              onSubmit={(e) => handleSubmit(e, list.id)}
            >
              <input
                type="text"
                value={addTask[list.id]}
                placeholder="+ new task"
                autoComplete="off"
                onChange={(e) => handleAddTask(e, list.id)}
              />
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
export default List;
