import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Navbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";

// Pages
import Home from "./wpages/Home.jsx";
import AuthPage from "./wpages/AuthPage.jsx";
import LeaderboardPage from "./wpages/LeaderboardPage.jsx";
import LobbyOnline from "./wpages/LobbyOnline.jsx";
import GameOnline from "./wpages/GameOnline.jsx";
import PersonsPage from "./pages/PersonsPage";
import CreateLobby from "./wpages/CreateLobby.js";
import GameSetup from "./wpages/GameSetup.js";
import WerewolfGame from "./pages/WerewolfGame.jsx";

function AppShell() {
  const { user, logout } = useAuth();

  // For responsive nav, track mobile menu open
  const [navOpen, setNavOpen] = useState(false);

  // Optional: Implement tracking which lobby the user is in/running game, etc. For now: just basic nav.

  return (
    <>
      <div className="app-shell">
        {/* Sticky Navbar */}
        <Navbar expand="lg" className="navbar-dark-red" variant="dark" sticky="top" style={{ background: '#0a0a0a' }}>
          <Container>
            <Navbar.Brand as={Link} to="/">
              <span className="navbar-brand-title" style={{ color: '#fff', textShadow: '0 1px 8px #fff5' }}>WEREWOLVES</span>{' '}
              <span className="navbar-brand-pill">ONLINE</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="main-navbar" onClick={() => setNavOpen(!navOpen)} />
            <Navbar.Collapse id="main-navbar" in={navOpen}>
              <Nav className="me-auto">
                <LinkContainer to="/">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/lobby-online">
                  <Nav.Link>Lobby</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/leaderboard">
                  <Nav.Link>Leaderboard</Nav.Link>
                </LinkContainer>
              </Nav>
              <Nav className="ms-auto align-items-center">
                {user ? (
                  <>
                    <Nav.Item className="me-2 text-light small">
                      <span style={{fontWeight:600}}>&#128100; {user.username}</span>
                    </Nav.Item>
                    <Nav.Link as="button" onClick={logout} style={{borderRadius:"999px"}}>
                      Logout
                    </Nav.Link>
                  </>
                ) : (
                  <LinkContainer to="/auth">
                    <Nav.Link>Login / Register</Nav.Link>
                  </LinkContainer>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {/* Seite */}
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/lobby-online" element={<LobbyOnline />} />
            <Route path="/game-online/:code" element={<GameOnline />} />
            <Route path="/game/:code" element={<WerewolfGame />} />
            <Route path="/persons" element={<PersonsPage />} />
            {/* evtl. weitere Seiten */}
            {/* Prototyp-Local Werwölfe: */}
            <Route path="/create-lobby" element={<CreateLobby />} />
            <Route path="/game-setup" element={<GameSetup />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
