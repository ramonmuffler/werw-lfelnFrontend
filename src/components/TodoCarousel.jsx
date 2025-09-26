import { Carousel, Card, Button } from 'react-bootstrap';

export default function TodoCarousel({ todos, toggleTodo, deleteTodo }) {
  if (!todos.length) return <p>No todos available.</p>;

  return (
    <Carousel interval={null}> {/* no auto-slide */}
      {todos.map(todo => (
        <Carousel.Item key={todo.id}>
          <div className="d-flex justify-content-center py-4">
            <Card style={{ width: '18rem' }}>
              <Card.Body className="text-center">
                <Card.Title
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                >
                  {todo.title}
                </Card.Title>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
