import { useState } from "react";
import("../styles/List.css");

import DeleteIcon from "@mui/icons-material/Delete";
import Radio from "@mui/material/Radio";




function List({ lists, tasks, onDeleteList, onDeleteTask, updateTasks }) {
  //Count number of tasks
  const [addTask, setAddTask] = useState({});

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
      updateTasks();
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
              <h2>{list.name}</h2>
              <p>{countTasks(list.id)}</p>
            </div>
            <button
              value={list.id}
              onClick={()=>onDeleteList(list.id)}
            >
              <DeleteIcon className="icon" />
            </button>
          </div>
          <div className="list-items">
     
   
                {tasks
                  .filter((task) => task.list_id === list.id)
                  .map((task) => (
                    <div key={task.id} className="task">
                    <Radio 
                      value={task.id}
                      onClick={(e) => onDeleteTask(e.target.value)} size="small" sx={{
                        color: "#DED0B6",
                        '&.Mui-checked': {
                          color: "#DED0B6",
                        },
                      }}/>
                      <span>{task.task}</span>
                   </div>
                      
     
                  ))}

      
            <form className="add-task" onSubmit={(e) => handleSubmit(e, list.id)}>
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
