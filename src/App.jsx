import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { Navbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

// Pages
import ListGroupView from "./pages/ListGroupView";
import CardsView from "./pages/CardsView";
import TableView from "./pages/TableView";
import CarouselView from "./pages/CarouselView";
import Search from "./pages/Search";
import Home from "./pages/Home";
import PersonsPage from "./pages/PersonsPage";

function App() {
  const [todos, setTodos] = useState([]);

  // Fetch todos from backend
  const fetchTodos = () => {
    axios.get("http://localhost:8080/api/todos")
      .then(res => setTodos(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add new todo
  const addTodo = (title) => {
    axios.post("http://localhost:8080/api/todos", { title, completed: false })
      .then(fetchTodos)
      .catch(err => console.error(err));
  };

  // Toggle completed
  const toggleTodo = (id, completed) => {
    const todo = todos.find(t => t.id === id);
    axios.put(`http://localhost:8080/api/todos/${id}`, { title: todo.title, completed: !completed })
      .then(fetchTodos)
      .catch(err => console.error(err));
  };

  // Delete todo
  const deleteTodo = (id) => {
    axios.delete(`http://localhost:8080/api/todos/${id}`)
      .then(fetchTodos)
      .catch(err => console.error(err));
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>TodoApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/"><Nav.Link>Home</Nav.Link></LinkContainer>
              <LinkContainer to="/listgroup"><Nav.Link>List Group</Nav.Link></LinkContainer>
              <LinkContainer to="/cards"><Nav.Link>Cards</Nav.Link></LinkContainer>
              <LinkContainer to="/table"><Nav.Link>Table</Nav.Link></LinkContainer>
              <LinkContainer to="/carousel"><Nav.Link>Carousel</Nav.Link></LinkContainer>
              <LinkContainer to="/search"><Nav.Link>Search</Nav.Link></LinkContainer>
              <LinkContainer to="/persons"><Nav.Link>Persons</Nav.Link></LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/listgroup"
          element={<ListGroupView todos={todos} addTodo={addTodo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />}
        />
        <Route
          path="/cards"
          element={<CardsView todos={todos} addTodo={addTodo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />}
        />
        <Route
          path="/table"
          element={<TableView todos={todos} addTodo={addTodo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />}
        />
        <Route
          path="/carousel"
          element={<CarouselView todos={todos} addTodo={addTodo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />}
        />
        <Route
          path="/search"
          element={<Search />}
        />
        {/* Default route */}
        <Route
          path="/"
          element={<ListGroupView todos={todos} addTodo={addTodo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />}
        />
        <Route
          path="/persons"
          element={<PersonsPage />}
        />
      </Routes>
    </>
  );
}

export default App;
