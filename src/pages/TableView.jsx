import TodoForm from "../components/TodoForm";
import TodoListTable from "../components/TodoListTable";

export default function TableView({ todos, addTodo, toggleTodo, deleteTodo }) {
  return (
    <div className="container mt-5">
      <h1 className="text-primary mb-4">Todos - Table</h1>
      <TodoForm addTodo={addTodo} />
      <TodoListTable todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
    </div>
  );
}
