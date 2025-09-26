import TodoForm from "../components/TodoForm";
import TodoListCards from "../components/TodoListCards";

export default function CardsView({ todos, addTodo, toggleTodo, deleteTodo }) {
  return (
    <div className="container mt-5">
      <h1 className="text-primary mb-4">Todos - Cards</h1>
      <TodoForm addTodo={addTodo} />
      <TodoListCards todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
    </div>
  );
}
