import TodoForm from "../components/TodoForm";
import TodoCarousel from "../components/TodoCarousel";

export default function CarouselView({ todos, addTodo, toggleTodo, deleteTodo }) {
  return (
    <div className="container mt-5">
      <h1 className="text-primary mb-4">Todos - Carousel</h1>
      <TodoForm addTodo={addTodo} />
      <TodoCarousel todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
    </div>
  );
}
