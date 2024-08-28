import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const login = (user, authToken) => {
    const decodedToken = jwtDecode(authToken);
    setIsAuthenticated(true);
    setCurrentUser({
      id: decodedToken.id,
      username: decodedToken.username,
      email: decodedToken.email,
      defaultAddressId: decodedToken.defaultAddressId,
    });
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
