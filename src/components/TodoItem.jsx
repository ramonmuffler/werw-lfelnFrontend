import { ListGroup, Button } from 'react-bootstrap';

export default function TodoItem({ todo, toggleTodo, deleteTodo }) {
  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-center"
      style={{ cursor: 'pointer', textDecoration: todo.completed ? 'line-through' : 'none' }}
      onClick={() => toggleTodo(todo.id, todo.completed)}
    >
      {todo.title}
      <Button
        variant="danger"
        size="sm"
        onClick={(e) => { 
          e.stopPropagation(); // prevent toggle when deleting
          deleteTodo(todo.id); 
        }}
      >
        Delete
      </Button>
    </ListGroup.Item>
  );
}
