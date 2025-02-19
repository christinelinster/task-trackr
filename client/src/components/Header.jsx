import { useState } from "react";
import "../styles/header.css"
import ListMenu from "./ListMenu";

function Header({lists, onUpdateLists, onSelectedLists}) {

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
        <button type="submit"> + New List</button>
      </form>
      <ListMenu lists={lists} onSelectedLists={onSelectedLists} />
    </div>
  );
}

export default Header;
