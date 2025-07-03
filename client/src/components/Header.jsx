import { useState } from "react";
import "../styles/header.css"

function Header({onUpdateLists}) {

  const [list, setList] = useState("");

  async function handleSubmit(e){
    e.preventDefault();

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; 
  
    try {
        if(list.trim() == "") return;
        const response = await fetch(`${API_URL}/api/lists`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Set the content type to JSON
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            body: JSON.stringify({
                list:list
            }),
        });

        const data = await response.json();
        
        console.log("New list added: ", data);
        setList("");
        onUpdateLists();

    } catch (err) {
        console.error("Error adding list:", err);
    }
}

  return (
    <div id="header">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value = {list}
          placeholder="Add a new list"
          autoComplete="off"
          onChange={(e) => setList(e.target.value)}
        />
        <button type="submit"> + Add List</button>
      </form>
    </div>
  );
}

export default Header;
