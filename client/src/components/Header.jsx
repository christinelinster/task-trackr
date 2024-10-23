import { useState } from "react";
import "../styles/Header.css"

function Header({updateLists}) {

  // Get current date
  const today = new Date().toLocaleDateString("default", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });

  const [list, setList] = useState("");
  
  async function handleSubmit(e){
    e.preventDefault();

    try {
        const response = await fetch("/api/lists",{
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Set the content type to JSON
              },
            body: JSON.stringify({
                list:list
            }),
        });

        const data = await response.json();
        console.log("New list added: ", data);
        setList("");
        updateLists();

    } catch (err) {
        console.error("Error adding list:", err);
    }
}

  return (
    <div id="header">
      <h1>TASK TRACKR</h1>
      <p className="date">{today}</p>

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
    </div>
  );
}

export default Header;
