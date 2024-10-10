import { useState } from "react";

function List({ lists, tasks, onDeleteList, onDeleteTask, updateTasks }) {
  //Count number of tasks
  const [addTask, setAddTask] = useState({});

  function countTasks(listID) {
    let listLength = tasks.filter((task) => task.list_id === listID).length;
    return listLength === 1
    ? `${listLength} task left`
    : `${listLength} tasks left`
  }

  function handleAddTask(e, listID){
   setAddTask((prevValue) => ({
    ...prevValue,
    [listID]: e.target.value,
   }))
  }
  
  async function handleSubmit(e, listID) {
    e.preventDefault();
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addTask: addTask[listID],
          listID: listID 
        }),
      });
      const data = await response.json();
      console.log("New task added", data)
      setAddTask((prevValue) => ({
        ...prevValue,
        [listID]: "",
      }))
      updateTasks();

    } catch (err) {
      console.error("Error adding task", err)
    }

  }

  return (
    <div>
      {lists.map((list) => (
        <div key={list.id}>
          <h2>{list.name}</h2>
          <p>{countTasks(list.id)}</p>
          <button value={list.id} onClick={(e) => onDeleteList(e.target.value)}>
            Delete
          </button>
          <ul>
            {tasks
              .filter((task) => task.list_id === list.id)
              .map((task) => (
                <li
                  key={task.id}
                  value={task.id}
                  onClick={(e) => onDeleteTask(e.target.value)}
                >
                  {task.task}
                </li>
              ))}
          </ul>
          <input type="text" />
          <form onSubmit={(e) => handleSubmit(e, list.id)}>
            <input
              type="text"
              value={addTask[list.id]}
              placeholder="Add a task"
              autoComplete="off"
              onChange={(e) => handleAddTask(e, list.id)}
            />
            <input type="text" value={list.id} hidden/>
            <button type="submit">+ Task</button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default List;
