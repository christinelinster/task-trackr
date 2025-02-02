import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Radio from "@mui/material/Radio";
import("../styles/list.css");

function List({
  lists,
  tasks,
  onDeleteList,
  onDeleteTask,
  onUpdateLists,
  onUpdateTasks,
  onEditList,
  onEditTask,
}) {
  const [addTask, setAddTask] = useState({});
  const [editListID, setEditListID] = useState(null);
  const [editTaskID, setEditTaskID] = useState(null);
  const [editList, setEditList] = useState("");
  const [editTask, setEditTask] = useState("");


  function countTasks(listID) {
    let listLength = tasks.filter((task) => task.list_id === listID).length;
    return listLength === 1
      ? `${listLength} task left`
      : `${listLength} tasks left`;
  }

  function handleEditTask(task){
    setEditTaskID(task.id);
    setEditTask(task.task);
  }

  function handleEditList(list){
    setEditListID(list.id);
    setEditList(list.name);
  }

  async function handleEnter(e) {
    if (e.keyCode === 13) {
      try {
        editTaskID ? handleSubmitEditTask() : handleSubmitEditList();
      } catch (err) {
        console.error("Failed to edit:", err);
      }
      e.target.blur();
    }
  }

  async function handleSubmitEditTask() {
    if(editTask.trim() == ""){
      await onDeleteTask(editTaskID);
    } else {
      await onEditTask(editTaskID, editTask.trim()); 
    }
    setEditTaskID(null);
    setEditTask("");
  }

  async function handleSubmitEditList() {
    if (editList.trim() == "") {
      onUpdateLists();
    } else {
      await onEditList(editListID, editList.trim());
    }
    setEditListID(null);
    setEditList("");
  }

  function handleAddTask(e, listID) {
    setAddTask((prevValue) => ({
      ...prevValue,
      [listID]: e.target.value,
    }));
  }

  async function handleSubmitAddTask(e, listID) {
    e.preventDefault();
    if (!addTask[listID] || addTask[listID].trim() == "") return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          addTask: addTask[listID].trim(),
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
        list.selected ? ( <div className="list" key={list.id}>
          <div className="list-title">
            <div>
              {editListID === list.id ? (
                <input
                  autoFocus
                  type="text"
                  value={editList}
                  onChange={(e) => setEditList(e.target.value)}
                  onKeyDown={(e) => handleEnter(e)}
                  onBlur={handleSubmitEditList}
                />
              ) : (
                <h2 onClick={() => handleEditList(list)}>{list.name}</h2>
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
                  {editTaskID === task.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}
                      onKeyDown={(e) => handleEnter(e)}
                      onBlur={handleSubmitEditTask}
                    />
                  ) : (
                    <p onClick={() => handleEditTask(task)}>{task.task}</p>
                  )}
                </div>
              ))}

            <form
              className="add-task"
              onSubmit={(e) => handleSubmitAddTask(e, list.id)}
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
        </div>) : false
      ))}
    </div>
  );
}
export default List;
