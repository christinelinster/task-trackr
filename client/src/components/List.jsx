

function List({lists, tasks, onDelete}){
  
    //Count number of tasks
  
    function countTasks(listID){
      let listLength = tasks.filter((task) => task.list_id === listID).length;
      if(listLength == 1){
        return (listLength + " task left")
      } else {
        return (listLength + " tasks left")
      }
    };

    // Delete list 
    function handleDeleteList(e){
      const id = e.target.value;
      onDelete(id)
;    }
  
    return (
      <div>
        {lists.map((list) => (
          <div key={list.id}>
            <h2>{list.name}</h2>
            <p>{countTasks(list.id)}</p>
            <button value={list.id} onClick={handleDeleteList}>Delete</button>
            <ul>
              {tasks
                .filter((task) => task.list_id === list.id)
                .map((task) => (
                  <li key={task.id}>{task.task}</li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    );

}

export default List;