import { useEffect, useState } from "react";
import Header from "./Header";
import List from "./List";
import ListMenu from "./ListMenu";

function App() {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedLists, setSelectedLists] = useState([]);

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

      const data = response.json();
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
      const data = response.json();
      console.log("Task updated: ", data);
      fetchTasks();
    } catch (err) {
      console.error("Error editing task:", err);
      throw err;
    }
  }

  // Initial data fetching
  useEffect(() => {
    fetchLists();
    fetchTasks();
  }, []);

  const handleSelectedLists = (listId) => {
    setSelectedLists((prevSelected) => {
      if (prevSelected.includes(listId)) {
        return prevSelected.filter((id) => id !== listId);
      } else {
        return [...prevSelected, listId];
      }
    });
  };

  return (
    <div id="main">
      <ListMenu
        lists={lists}
        selectedLists={selectedLists}
        onSelectedLists = {handleSelectedLists}
      />
      <Header onUpdateLists={fetchLists} onSelectedLists = {handleSelectedLists}/>
      <List
        lists={lists}
        tasks={tasks}
        selectedLists={selectedLists}
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

export default App;
