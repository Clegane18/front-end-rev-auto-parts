import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setIsAuthenticated(true);
        setCurrentUser({
          id: decodedToken.id,
          username: decodedToken.username,
          email: decodedToken.email,
          defaultAddressId: decodedToken.defaultAddressId,
        });
        setToken(storedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const login = (user, authToken) => {
    try {
      const decodedToken = jwtDecode(authToken);
      setIsAuthenticated(true);
      setCurrentUser({
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email,
        defaultAddressId: decodedToken.defaultAddressId,
      });
      setToken(authToken);
      localStorage.setItem("authToken", authToken);
      navigate("/online-store");
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setToken("");
    localStorage.removeItem("authToken");
    navigate("/customer-login");
  };

  const updateUserContext = (newData) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      ...newData,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        token,
        login,
        logout,
        updateUserContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
