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
  onUpdateLists,
  onEditTask,
  onEditList,
}) {
  const [addTask, setAddTask] = useState({});
  const [editID, setEditID] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editList, setEditList] = useState("");

  function countTasks(listID) {
    let listLength = tasks.filter((task) => task.list_id === listID).length;
    return listLength === 1
      ? `${listLength} task left`
      : `${listLength} tasks left`;
  }

  function handleEdit(item) {
    setEditID(item.id);
    setEditTask(item.task) || setEditList(item.name);
  }

  async function handleEnter(e) {
    if (e.keyCode === 13) {
        try {
          handleEditTask() || handleEditList();
        } catch (err) {
          console.error("Failed to edit task:", err);
        }
      e.target.blur();
    }
  }

  async function handleEditTask() {
    await onEditTask(editID, editTask);
    setEditID(null);
    setEditTask("")
  }

  async function handleEditList(){
    if(editList.replace(/\s+/g, "") == ""){
      onUpdateLists();
    } else {
      await onEditList(editID, editList);
      setEditList(null);
      setEditList("")
    }
  }

  function handleAddTask(e, listID) {
    setAddTask((prevValue) => ({
      ...prevValue,
      [listID]: e.target.value,
    }));
  }

  async function handleSubmit(e, listID) {
 if(addTask[listID].replace(/\s+/g, "") == ""){
  return false;
 }
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

  return (
    <div className="cards">
      {lists.map((list) => (
        <div className="list" key={list.id}>
          <div className="list-title">
            <div>
              {editID === list.id ? (
                <input
                  autoFocus
                  type="text"
                  value={editList}
                  onChange={(e) => setEditList(e.target.value)}
                  onKeyDown={(e) => handleEnter(e)}
                  onBlur={(e) => handleEditList(e)}
                />
              ) : (
                <h2 onClick={() => handleEdit(list)}>{list.name}</h2>
              )}
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
                      onBlur={(e) => handleEditTask(e)}
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
