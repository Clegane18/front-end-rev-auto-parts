import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const login = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user); // Set the current user upon login
    navigate("/online-store"); // Redirect to store after login
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null); // Clear the current user upon logout
    navigate("/customer-login"); // Redirect to login page
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
