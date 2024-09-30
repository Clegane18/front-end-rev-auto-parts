import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getTokenExpirationTime, getRemainingTime } from "../utils/authUtils";
import LogoutModal from "../components/LogoutModal";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logoutTimer = useRef(null);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setToken("");
    localStorage.removeItem("authToken");
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    navigate("/customer-login");
  }, [navigate]);

  const handleTokenExpiration = useCallback(() => {
    setIsModalOpen(true);
    setTimeout(() => {
      logout();
    }, 3000);
  }, [logout]);

  const setAutoLogout = useCallback(
    (expirationTime) => {
      const remainingTime = getRemainingTime(expirationTime);
      if (remainingTime <= 0) {
        handleTokenExpiration();
      } else {
        logoutTimer.current = setTimeout(() => {
          handleTokenExpiration();
        }, remainingTime);
      }
    },
    [handleTokenExpiration]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const expirationTime = getTokenExpirationTime(storedToken);

        if (expirationTime && Date.now() < expirationTime) {
          setIsAuthenticated(true);
          setCurrentUser({
            id: decodedToken.id,
            username: decodedToken.username,
            email: decodedToken.email,
            defaultAddressId: decodedToken.defaultAddressId,
          });
          setToken(storedToken);
          setAutoLogout(expirationTime);
        } else {
          handleTokenExpiration();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        handleTokenExpiration();
      }
    }

    return () => {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    };
  }, [handleTokenExpiration, setAutoLogout]);

  const login = useCallback(
    (user, authToken) => {
      try {
        const decodedToken = jwtDecode(authToken);
        const expirationTime = getTokenExpirationTime(authToken);

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
        if (expirationTime) {
          setAutoLogout(expirationTime);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    },
    [navigate, setAutoLogout]
  );

  const updateUserContext = useCallback((newData) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      ...newData,
    }));
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    logout();
  }, [logout]);

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
      <LogoutModal
        isOpen={isModalOpen}
        message="Your session has expired due to inactivity."
        onClose={handleModalClose}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
