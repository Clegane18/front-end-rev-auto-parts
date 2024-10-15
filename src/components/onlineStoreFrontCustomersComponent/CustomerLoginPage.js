import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useRequireAuth from "../../utils/useRequireAuth";
import "../../styles/onlineStoreFrontCustomersComponent/CustomerLoginPage.css";
import googleLogo from "../../assets/google-logo.png";
import { login } from "../../services/online-store-front-customer-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import LoginHeader from "./LoginHeader";
import { useLoading } from "../../contexts/LoadingContext";

const CustomerLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginUser, isAuthenticated } = useAuth();
  const checkAuth = useRequireAuth();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const result = await login({ email, password });

      if (result.status === 403) {
        navigate("/account-suspended");
        return;
      }

      if (result.status !== 200) {
        setError(result.data.message || "An error occurred.");
        return;
      }

      const token = result.data.token;

      if (!token || typeof token !== "string") {
        setError("Invalid token received.");
        console.error("Invalid token:", token);
        return;
      }

      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
      } catch (decodeError) {
        setError("Failed to decode token.");
        console.error("Failed to decode token:", decodeError);
        return;
      }

      const user = {
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email,
      };

      loginUser(user, token);

      checkAuth("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate("/create-account");
  };

  const handleResetPassword = () => {
    navigate("/reset-password");
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "https://rev-auto-parts.onrender.com/api/auth/google/callback";
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const user = {
        id: decodedToken.id,
        token: token,
        username: decodedToken.username,
        email: decodedToken.email,
      };
      loginUser(user, token);
      checkAuth("/");
    }
  }, [location.search, loginUser, checkAuth]);

  return (
    <div id="root-customer-login-page">
      <LoginHeader />
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="form-container">
          <div className="input-group">
            <label className="email-lbl">Email</label>
            <div className="input-icon">
              <FontAwesomeIcon icon={faEnvelope} className="input-field-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-group password-group">
            <label className="pass-lbl">Password</label>
            <div className="input-icon">
              <FontAwesomeIcon icon={faLock} className="input-field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-button"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <button type="submit" className="sign-in-button">
            Sign In
          </button>
        </form>
        <div className="google-login">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="google-button"
          >
            <img src={googleLogo} alt="Google logo" className="google-logo" />
            Sign in with Google
          </button>
        </div>
        <div className="additional-options">
          <button
            type="button"
            onClick={handleCreateAccount}
            className="create-account-link"
          >
            Create account
          </button>
        </div>
        <div className="forgot-password">
          <button
            type="button"
            onClick={handleResetPassword}
            className="create-account-link"
          >
            Forgot your password?
          </button>
        </div>
      </div>
      <div className="login-footer">
        <p>
          We're glad to see you! Let’s get started and enjoy a seamless shopping
          experience.
        </p>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
