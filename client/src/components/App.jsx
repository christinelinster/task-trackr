import { useEffect, useState } from "react";
import Header from "./Header";
import List from "./List";


function App() {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);

  // Fetch the data from /api/tasks
  async function fetchTasks(){
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      console.log(data);
      setTasks(data);
    } catch (err) {
      console.error("Error fetching items:", err)
    }
  }

  // Fetch the data from /api/lists
  async function fetchLists(){
    try {
      const response = await fetch("/api/lists");
      const data = await response.json();
      console.log(data);
      setLists(data);
    } catch (err) {
      console.error("Error fetching items:", err)
    }
  }

  // Delete list from /api/lists/:id
async function handleDeleteList(listID){
  try {
    const response = await fetch(`/api/lists/${listID}`, {
      method: "DELETE"
    })
    const data = await response.json();
    console.log("List deleted: ", data);
    fetchLists();
  } catch (err) {
    console.error("Error deleting list:", err)
  }
}

async function handleDeleteTask(taskID) {
  try {
    const response = await fetch(`/api/tasks/${taskID}`, {
      method: "DELETE"
    })
    const data = await response.json();
    console.log("Task deleted: ", data);
    fetchTasks();
  } catch (err) {
    console.error("Error deleting task:", err)
  }
}

// Initial data fetching
  useEffect(() => {
    fetchLists();
    fetchTasks();
  }, []);

  return(
    <div id="main">
      <Header updateLists = {fetchLists}/>
      <List
      lists={lists}
      tasks={tasks}
      onDeleteList  = {handleDeleteList}
      onDeleteTask = {handleDeleteTask}
      updateTasks = {fetchTasks}
      />
    </div>
  )

}

export default App;
