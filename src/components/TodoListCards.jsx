import { Card, Button } from 'react-bootstrap';

export default function TodoListCards({ todos, toggleTodo, deleteTodo }) {
  return (
    <div className="d-flex flex-wrap gap-3">
      {todos.map(todo => (
        <Card key={todo.id} style={{ width: '18rem' }}>
          <Card.Body className="text-center">
            <Card.Title
              style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }}
              onClick={() => toggleTodo(todo.id, todo.completed)}
            >
              {todo.title}
            </Card.Title>
            <Button variant="danger" size="sm" onClick={() => deleteTodo(todo.id)}>
              Delete
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
