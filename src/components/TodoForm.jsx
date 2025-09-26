import { useState } from "react";

export default function TodoForm({ addTodo }) {
  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    addTodo(newTodo);
    setNewTodo("");
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex mb-4">
      <input
        type="text"
        className="form-control me-2"
        placeholder="Enter a new task"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button className="btn btn-success">Add</button>
    </form>
  );
}
