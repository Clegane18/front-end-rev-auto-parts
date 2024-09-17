import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../../services/online-store-front-customer-api";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/onlineStoreFrontCustomersComponent/CreateAccountPage.css";
import LoginHeader from "./LoginHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import TermsAndConditionsModal from "./TermsAndConditionsModal";

const CreateAccountPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCreateAccount = async (event) => {
    event.preventDefault();

    if (!isTermsAgreed) {
      setShowModal(true);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const result = await signUp({ username, email, password });

      login(result.accountInfo, result.token);

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div id="root-create-account-page">
      <LoginHeader />
      <div className="create-account-container">
        <h2>Create Account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleCreateAccount} className="form-container">
          <div className="input-group">
            <label>Username</label>
            <div className="input-icon">
              <FontAwesomeIcon icon={faUser} className="input-field-icon" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>Email</label>
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
            <label>Password</label>
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
          <div className="input-group password-group">
            <label>Confirm Password</label>
            <div className="input-icon">
              <FontAwesomeIcon icon={faLock} className="input-field-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="password-toggle-button"
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
          </div>
          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={isTermsAgreed}
              onChange={(e) => setIsTermsAgreed(e.target.checked)}
            />
            <label htmlFor="termsCheckbox">
              I have read and agree to the terms and conditions.
            </label>
          </div>
          <button type="submit" className="create-account-button">
            Create Account
          </button>
        </form>
        <div className="additional-options">
          <button
            type="button"
            onClick={() => navigate("/customer-login")}
            className="create-account-link"
          >
            Already have an account? Log in
          </button>
          <p className="terms-link">
            By creating an account, you agree to our{" "}
            <Link to="/terms-and-conditions">Terms and Conditions</Link>.
          </p>
        </div>
      </div>
      <TermsAndConditionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      <div className="login-footer">
        <p>
          We're glad to see you! Let’s get started and enjoy a seamless shopping
          experience.
        </p>
      </div>
    </div>
  );
};

export default CreateAccountPage;
