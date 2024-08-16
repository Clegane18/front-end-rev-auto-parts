import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const login = (user, authToken) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setToken(authToken);
    navigate("/online-store");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setToken("");
    navigate("/customer-login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
