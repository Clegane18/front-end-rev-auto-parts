import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/onlineStoreFrontCustomersComponent/ChangePasswordPage.css";
import { changePassword } from "../../services/online-store-front-customer-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import LoginHeader from "./LoginHeader";
import { useLoading } from "../../contexts/LoadingContext";

const ChangePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await changePassword(
        token,
        newPassword,
        confirmPassword
      );
      setMessage(response.message);
      navigate("/customer-login");
    } catch (error) {
      console.error("Error in handleChangePassword:", error);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div id="root-change-password">
      <LoginHeader />
      <div className="change-password-container">
        <h2>Change Your Password</h2>
        <p>Please set your new password.</p>
        {message && <p className="error-message">{message}</p>}
        <form onSubmit={handleChangePassword}>
          <div className="input-group">
            <label>New Password</label>
            <div className="input-icon">
              <FontAwesomeIcon icon={faLock} className="input-field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
          <div className="input-group">
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
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
