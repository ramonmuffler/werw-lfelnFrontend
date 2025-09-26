import TodoForm from "../components/TodoForm";
import TodoListListGroup from "../components/TodoListListGroup";

export default function ListGroupView({ todos, addTodo, toggleTodo, deleteTodo }) {
  return (
    <div className="container mt-5">
      <h1 className="text-primary mb-4">Todos - List Group</h1>
      <TodoForm addTodo={addTodo} />
      <TodoListListGroup todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
    </div>
  );
}
