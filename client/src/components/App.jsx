import { useEffect, useState } from "react";
import Header from "./Header";
import List from "./List";


function App() {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);

  // Fetch the data from /api/items 
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

  // Fetch the data from /api/categories
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


// Initial data fetching
  useEffect(() => {
    fetchLists();
    fetchTasks();
  }, []);

  return(
    <div>
      <Header updateLists = {fetchLists}/>
      <List
      lists={lists}
      tasks={tasks}
      onDelete = {handleDeleteList}
      />
  
    </div>
  )

}

export default App;
