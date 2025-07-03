import { useEffect, useState } from "react";
import Header from "../components/Header";
import List from "../components/List";
import Navbar from "../components/Navbar";

export default function Home({ setIsAuthenticated }) {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);

  async function fetchHomeData() {
    try {
      fetchLists();
      fetchTasks();
    } catch (err) {
      console.log(err);
      console.error("Error fetching home data:", err);
    }
  }

  // Fetch the data from /api/tasks
  async function fetchTasks() {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    let accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 403) {
        console.log("Access token expired. Attempting refresh.");
        accessToken = await refreshAccessToken();

        if (!accessToken) {
          console.log("Refresh token invalid. Logging out.");
          setIsAuthenticated(false);
          return;
        }

        return fetchTasks();
      }

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  }

  // Fetch the data from /api/lists
  async function fetchLists() {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    let accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_URL}/api/lists/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 403) {
        console.log("Access token expired. Attempting refresh.");
        accessToken = await refreshAccessToken();

        if (!accessToken) {
          console.log("Refresh token invalid. Logging out.");
          setIsAuthenticated(false);
          return;
        }

        return fetchLists();
      }

      if (!response.ok) {
        throw new Error("Failed to fetch lists");
      }

      const data = await response.json();
      setLists(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  }

  const refreshAccessToken = async () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await fetch(`${API_URL}/api/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    } else {
      throw new Error("Failed to refresh access token");
    }
  };

  // Delete list from /api/lists/:id
  async function handleDeleteList(listID) {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      const response = await fetch(`${API_URL}/api/lists/${listID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
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
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      console.log("Task deleted: ", data);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  }

  async function handleEditList(listID, newListValue) {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      const response = await fetch(`${API_URL}/api/lists/${listID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
    console.log("Selecting list with ID:", listID);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    let accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_URL}/api/lists/selected`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          listId: listID,
        }),
      });

      if (response.status === 403) {
        console.log("Access token expired. Attempting refresh.");
        accessToken = await refreshAccessToken();

        if (!accessToken) {
          console.log("Refresh token invalid. Logging out.");
          setIsAuthenticated(false);
          return;
        }
        
        return handleSelectedLists(listID);
      }

      if (!response.ok) {
        throw new Error("Failed to update selected lists");
      }

      const updatedList = await response.json();
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === updatedList.id ? updatedList : list
        )
      );
    } catch (err) {
      console.error("Error selecting list:", err);
      throw err;
    }
  }

  // Initial data fetching
  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <div id="main">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
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
