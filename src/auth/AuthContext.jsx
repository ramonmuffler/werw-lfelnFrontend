import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize user directly from localStorage so it's available on first render
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("werewolves_user");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem("werewolves_user");
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const saveUser = (data) => {
    setUser(data);
    localStorage.setItem("werewolves_user", JSON.stringify(data));
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("werewolves_user");
  };

  const register = async (username, password) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", {
        username,
        password,
      });
      saveUser(res.data);
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e.response?.data?.error || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });
      saveUser(res.data);
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e.response?.data?.error || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


