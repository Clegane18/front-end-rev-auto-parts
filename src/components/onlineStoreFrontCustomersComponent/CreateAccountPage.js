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
import { useLoading } from "../../contexts/LoadingContext";
import { useTerms } from "../../contexts/TermsContext";
import { useFormData } from "../../contexts/FormDataContext";

const CreateAccountPage = () => {
  const { formData, setFormData, clearFormData } = useFormData();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const { isTermsAgreed, resetTermsAgreement } = useTerms();
  const [showModal, setShowModal] = useState(false);
  const { login } = useAuth();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const handleCreateAccount = async (event) => {
    event.preventDefault();

    if (!isTermsAgreed) {
      setShowModal(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp(formData);
      login(result.accountInfo, result.token);
      clearFormData();
      resetTermsAgreement();
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
                name="username"
                value={formData.username}
                onChange={handleInputChange}
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
                name="email"
                value={formData.email}
                onChange={handleInputChange}
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
                name="password"
                value={formData.password}
                onChange={handleInputChange}
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
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
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
            <Link
              to="/terms-and-conditions"
              state={{ fromCreateAccount: true }}
            >
              Terms and Conditions
            </Link>
            .
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
