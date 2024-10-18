import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/onlineStoreFrontCustomersComponent/RequestChangePasswordManualPage.css";
import { verifyOldPassword } from "../../services/online-store-front-customer-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import LoginHeader from "./LoginHeader";
import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../contexts/AuthContext";

const RequestChangePasswordManualPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const { customerId, token } = useAuth();

  const handleVerifyOldPassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await verifyOldPassword({
        customerId,
        oldPassword,
        token,
      });
      setMessage(response.message);
      if (response.status === 200) {
        navigate("/change-password-manual");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div id="root-request-change-password-manual">
      <LoginHeader />
      <div className="change-password-container">
        <h2>Change Your Password</h2>
        <p>Please enter your current password to proceed.</p>
        <strong>{message && <p className="message">{message}</p>}</strong>
        <form onSubmit={handleVerifyOldPassword}>
          <div className="input-group">
            <label>Old Password</label>
            <div className="input-icon">
              <FontAwesomeIcon icon={faLock} className="input-field-icon" />
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-button">
            Verify
          </button>
        </form>
        <button onClick={handleCancel} className="cancel-link">
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

export default RequestChangePasswordManualPage;
