export default function TodoListTable({ todos, toggleTodo, deleteTodo }) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Task</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {todos.map(todo => (
          <tr key={todo.id}>
            <td
              style={{ textDecoration: todo.completed ? "line-through" : "none", cursor: "pointer" }}
              onClick={() => toggleTodo(todo.id, todo.completed)}
            >
              {todo.title}
            </td>
            <td>{todo.completed ? "Completed" : "Active"}</td>
            <td>
              <button className="btn btn-sm btn-danger" onClick={() => deleteTodo(todo.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
