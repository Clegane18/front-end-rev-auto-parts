import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminAuthToken");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setIsAuthenticated(true);
        setCurrentAdmin({
          id: decodedToken.id,
          email: decodedToken.email,
          role: decodedToken.role,
        });
        setToken(storedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("adminAuthToken");
      }
    }
  }, []);

  const login = (authToken) => {
    try {
      const decodedToken = jwtDecode(authToken);
      setIsAuthenticated(true);
      setCurrentAdmin({
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role,
      });
      setToken(authToken);
      localStorage.setItem("adminAuthToken", authToken);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentAdmin(null);
    setToken("");
    localStorage.removeItem("adminAuthToken");
    navigate("/login");
  };

  const updateAdminContext = (newData) => {
    setCurrentAdmin((prevAdmin) => ({
      ...prevAdmin,
      ...newData,
    }));
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        currentAdmin,
        authToken: token,
        login,
        logout,
        updateAdminContext,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
