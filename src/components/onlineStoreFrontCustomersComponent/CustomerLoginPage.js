import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/onlineStoreFrontCustomersComponent/CustomerLoginPage.css";
import googleLogo from "../../assets/google-logo.png";
import { login } from "../../services/online-store-front-customer-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

const CustomerLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const result = await login({ email, password });
      const decodedToken = jwtDecode(result.token);
      const user = {
        id: decodedToken.id,
        token: result.token,
        username: decodedToken.username,
        email: decodedToken.email,
      };
      loginUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCreateAccount = () => {
    navigate("/create-account");
  };

  const handleResetPassword = () => {
    navigate("/reset-password");
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/online-store");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin} className="form-container">
        <div className="input-group">
          <label className="email-lbl">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group password-group">
          <label className="pass-lbl">Password</label>
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
        <div className="forgot-password">
          <button
            type="button"
            onClick={handleResetPassword}
            className="create-account-link"
          >
            Forgot your password?
          </button>
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
    </div>
  );
};

export default CustomerLoginPage;
