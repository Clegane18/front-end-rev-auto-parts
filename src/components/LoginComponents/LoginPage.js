import React, { useState } from "react";
import { adminLogIn } from "../../services/admin-api";
import "../../styles/LoginComponents/LoginPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAdminAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    try {
      const response = await adminLogIn({ email, password });

      login(response.token);
    } catch (error) {
      const message = error.message || "An unexpected error occurred.";

      if (message.toLowerCase().includes("email")) {
        setEmailError(message);
        setEmail("");
      } else if (message.toLowerCase().includes("password")) {
        setPasswordError(message);
        setPassword("");
      } else {
        setGeneralError(message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
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
                type="email"
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
              <span
                onClick={togglePasswordVisibility}
                className="password-toggle"
              >
                {showPassword ? (
                  <EyeOffIcon className="password-toggle-icon" />
                ) : (
                  <EyeIcon className="password-toggle-icon" />
                )}
              </span>
            </div>

            {generalError && (
              <div className="error-message">{generalError}</div>
            )}

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
