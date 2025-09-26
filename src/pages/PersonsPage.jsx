import { useEffect, useState } from 'react';
import { Card, ListGroup, Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';

export default function PersonsPage() {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/persons/with-todos')
      .then(res => setPersons(res.data))
      .catch(err => console.error(err));
  }, []);

  const toggleTodo = (todo) => {
    axios.put(`http://localhost:8080/api/todos/${todo.id}`, {
      ...todo,
      completed: !todo.completed
    }).then(() => {
      setPersons(prev =>
        prev.map(p => ({
          ...p,
          todos: p.todos.map(t =>
            t.id === todo.id ? { ...t, completed: !t.completed } : t
          )
        }))
      );
    });
  };

  const deleteTodo = (todoId) => {
    axios.delete(`http://localhost:8080/api/todos/${todoId}`)
      .then(() => {
        setPersons(prev =>
          prev.map(p => ({
            ...p,
            todos: p.todos.filter(t => t.id !== todoId)
          }))
        );
      });
  };

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Persons and Their Todos</h1>
      <Row className="g-3">
        {persons.map(person => (
          <Col key={person.id} xs={12} md={6} lg={4}>
            <Card>
              <Card.Header>{person.name}</Card.Header>
              <ListGroup variant="flush">
                {person.todos && person.todos.length > 0 ? (
                  person.todos.map(todo => (
                    <ListGroup.Item
                      key={todo.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span
                        style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }}
                        onClick={() => toggleTodo(todo)}
                      >
                        {todo.title}
                      </span>
                      <Button variant="danger" size="sm" onClick={() => deleteTodo(todo.id)}>
                        Delete
                      </Button>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No todos</ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
