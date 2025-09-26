import { Form, Button, ListGroup, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    if (!query.trim()) return;
    axios.get(`http://localhost:8080/api/todos/search?q=${query}`)
      .then(res => setResults(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Search Todos</h1>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search for a task..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="primary" onClick={handleSearch}>Search</Button>
      </InputGroup>

      <ListGroup>
        {results.map(todo => (
          <ListGroup.Item key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.title}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
