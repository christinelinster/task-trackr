import { useEffect, useState } from "react";
import Header from "../components/Header";
import List from "../components/List";
import Navbar from "../components/Navbar";


export default function Home({setIsAuthenticated}) {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);


  async function fetchHomeData(){
    const token = localStorage.getItem('token');
    try {
      const response = await fetch("/api/home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch home data");
      }
      const data = await response.json();
      setTasks(data.tasks);
      setLists(data.lists);
      
    } catch (err) {
      console.error("Error fetching home data:", err)
    }
  }

  // Fetch the data from /api/tasks
  async function fetchTasks() {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  }

  // Fetch the data from /api/lists
  async function fetchLists() {
    try {
      const response = await fetch("/api/lists");
      const data = await response.json();
      setLists(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  }

  // Delete list from /api/lists/:id
  async function handleDeleteList(listID) {
    try {
      const response = await fetch(`/api/lists/${listID}`, {
        method: "DELETE",
      });

      const data = await response.json();
      console.log("List deleted: ", data);
      fetchLists();
    } catch (err) {
      console.error("Error deleting list:", err);
    }
  }

  // Delete task from /api/tasks/:id
  async function handleDeleteTask(taskID) {
    try {
      const response = await fetch(`/api/tasks/${taskID}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log("Task deleted: ", data);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  }

  async function handleEditList(listID, newListValue) {
    try {
      const response = await fetch(`/api/lists/${listID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list: newListValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update list name");
      }

      const data = await response.json();
      console.log("List updated: ", data);
      fetchLists();
    } catch (err) {
      console.error("Error editing list name:", err);
    }
  }

  //Patch task from /api/tasks/:id
  async function handleEditTask(taskID, newTaskValue) {
    try {
      const response = await fetch(`/api/tasks/${taskID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: newTaskValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      const data = await response.json();
      console.log("Task updated: ", data);
      fetchTasks();
    } catch (err) {
      console.error("Error editing task:", err);
      throw err;
    }
  }

  async function handleSelectedLists(listID) {
    try {
      const response = await fetch(`/api/selected-lists`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listID: listID,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update selected lists");
      }

      const data = await response.json();
      console.log("Selected Lists: ", data);
      fetchLists();
    } catch (err) {
      console.err("Error selecting list:", err);
      throw err;
    }
  }

    // Initial data fetching
    useEffect(() => {
      fetchHomeData();
    }, []);

  return (
    <div id="main">
      <Navbar setIsAuthenticated={setIsAuthenticated}/>
      <Header
      lists={lists}
        onUpdateLists={fetchLists}
        onSelectedLists={handleSelectedLists}
      />
      <List
        lists={lists}
        tasks={tasks}
        onDeleteList={handleDeleteList}
        onDeleteTask={handleDeleteTask}
        onUpdateTasks={fetchTasks}
        onUpdateLists={fetchLists}
        onEditTask={handleEditTask}
        onEditList={handleEditList}
      />
    </div>
  );
}
