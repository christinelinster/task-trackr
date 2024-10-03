import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the data when the component mounts
  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setItems(data);       // Set the items data to state
        setLoading(false);    // Stop the loading spinner
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setLoading(false);    // Stop loading if there's an error
      });
  }, []);
  
  return (
    <div>
      <h1>Task List</h1>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {items.length > 0 ? (
            items.map((item) => (
              <li key={item.id}>
                <strong>Task:</strong> {item.task} <br />
                <strong>Category:</strong> {item.category}
              </li>
            ))
          ) : (
            <p>No tasks found</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default App;
