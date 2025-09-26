import { ListGroup, Button } from 'react-bootstrap';

export default function TodoListListGroup({ todos, toggleTodo, deleteTodo }) {
  return (
    <ListGroup>
      {todos.map(todo => (
        <ListGroup.Item
          key={todo.id}
          className="d-flex justify-content-between align-items-center"
          style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }}
          onClick={() => toggleTodo(todo.id, todo.completed)}
        >
          {todo.title}
          <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }}>
            Delete
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
