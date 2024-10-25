import React, { useState } from "react";
import {
  updateAdminEmail,
  updateAdminPassword,
} from "../../services/admin-api";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import SuccessModal from "../SuccessModal";
import "../../styles/LoginComponents/ChangeCredentialsPage.css";
import { useLoading } from "../../contexts/LoadingContext";

const ChangeCredentialsPage = () => {
  const { currentAdmin, authToken, updateAdminContext } = useAdminAuth();
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await updateAdminEmail(currentAdmin.id, newEmail, authToken);
      updateAdminContext({ email: newEmail });
      setSuccessMessage("Email updated successfully!");
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await updateAdminPassword(
        currentAdmin.id,
        oldPassword,
        newPassword,
        authToken
      );
      setSuccessMessage("Password updated successfully!");
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSuccessMessage("");
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  return (
    <div id="root-change-credentials-page">
      <div className="change-credentials-page-wrapper">
        <div className="change-credentials-content">
          <h2>Change Account Credentials</h2>

          <form onSubmit={handleEmailChange} className="change-form">
            <div className="form-group">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="change-input"
                placeholder="New Email"
              />
            </div>
            <button type="submit" className="change-email-button">
              Update Email
            </button>
          </form>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handlePasswordChange} className="change-form">
            <div className="form-group">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="change-input"
                placeholder="Old Password"
              />
              <span
                onClick={toggleOldPasswordVisibility}
                className="password-toggle"
              >
                <FontAwesomeIcon
                  icon={showOldPassword ? faEyeSlash : faEye}
                  className="password-toggle-icon"
                />
              </span>
            </div>
            <div className="form-group">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="change-input"
                placeholder="New Password"
              />
              <span
                onClick={toggleNewPasswordVisibility}
                className="password-toggle"
              >
                <FontAwesomeIcon
                  icon={showNewPassword ? faEyeSlash : faEye}
                  className="password-toggle-icon"
                />
              </span>
            </div>
            <div className="button-container">
              <button type="submit" className="change-button">
                Update Password
              </button>
              <button className="back-button" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <SuccessModal message={successMessage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ChangeCredentialsPage;
