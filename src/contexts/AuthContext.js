import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const login = (user) => {
    console.log("Logging in user:", user);
    setIsAuthenticated(true);
    setCurrentUser(user);
    navigate("/online-store");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate("/customer-login");
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
