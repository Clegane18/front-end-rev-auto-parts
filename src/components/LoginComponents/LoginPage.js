import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogIn } from "../../services/admin-api";
import "../../styles/LoginComponents/LoginPage.css";

const LoginPage = ({ setAuthToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await adminLogIn({ email, password });
      setAuthToken(response.token);
      navigate("/dashboard");
    } catch (error) {
      const { data } = error.response || {};
      setEmailError(data?.message?.includes("email") ? data.message : "");
      setPasswordError(
        data?.message?.includes("password") ? "Incorrect password" : ""
      );

      // Clear the incorrect input field
      if (data?.message?.includes("email")) {
        setEmail("");
      } else if (data?.message?.includes("password")) {
        setPassword("");
      }
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-content">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className={`form-group ${emailError ? "has-error" : ""}`}>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`login-input ${emailError ? "input-error" : ""}`}
              placeholder={emailError ? emailError : "Email"}
            />
          </div>
          <div className={`form-group ${passwordError ? "has-error" : ""}`}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`login-input ${passwordError ? "input-error" : ""}`}
              placeholder={passwordError ? passwordError : "Password"}
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
