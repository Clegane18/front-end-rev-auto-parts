import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/onlineStoreFrontCustomersComponent/ChangePasswordManualPage.css";
import { updatePassword } from "../../services/online-store-front-customer-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import LoginHeader from "./LoginHeader";
import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../contexts/AuthContext";

const ChangePasswordManualPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const { customerId, token } = useAuth();

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await updatePassword({
        customerId,
        newPassword,
        confirmPassword,
        token,
      });
      setMessage(response.message);
      if (response.status === 200) {
        navigate("/customer-login");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div id="root-change-password-manual">
      <LoginHeader />
      <div className="change-password-container">
        <h2>Change Your Password</h2>
        <p>Please set your new password.</p>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleChangePassword}>
          <div className="input-group">
            <label>New Password</label>
            <div className="input-icon">
              <FontAwesomeIcon icon={faLock} className="input-field-icon" />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="password-toggle-button"
              >
                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
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
        <button onClick={() => navigate("/account")} className="cancel-link">
          Cancel
        </button>
      </div>
      <div className="login-footer">
        <p>
          Your security is our priority. Make sure to choose a strong password
          to protect your account.
        </p>
      </div>
    </div>
  );
};

export default ChangePasswordManualPage;
