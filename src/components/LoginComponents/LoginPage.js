import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogIn } from "../../services/admin-api";
import "../../styles/LoginComponents/LoginPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

const LoginPage = ({ setAuthToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      if (data?.message?.includes("email")) {
        setEmail("");
      } else if (data?.message?.includes("password")) {
        setPassword("");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div id="root-login-page">
      <div className="login-page-wrapper">
        <div className="login-content">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className={`form-group ${emailError ? "has-error" : ""}`}>
              <FontAwesomeIcon icon={faUser} className="input-icon" />
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
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`login-input ${passwordError ? "input-error" : ""}`}
                placeholder={passwordError ? passwordError : "Password"}
              />
              {showPassword ? (
                <EyeOffIcon
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <EyeIcon
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
