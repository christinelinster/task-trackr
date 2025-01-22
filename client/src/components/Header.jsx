import { useState } from "react";
import "../styles/header.css"
import ListMenu from "./ListMenu";

function Header({lists, onUpdateLists, onSelectedLists}) {

  // Get current date
  // const today = new Date().toLocaleDateString("default", {
  //   month: "long",
  //   year: "numeric",
  //   day: "numeric",
  // });

  const [list, setList] = useState("");

  async function handleSubmit(e){
    e.preventDefault();

    try {
        if(list.trim() == "") return;
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
