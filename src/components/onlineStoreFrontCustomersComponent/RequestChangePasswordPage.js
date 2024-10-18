import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/onlineStoreFrontCustomersComponent/RequestChangePasswordPage.css";
import { requestChangePassword } from "../../services/online-store-front-customer-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import LoginHeader from "./LoginHeader";
import { useLoading } from "../../contexts/LoadingContext";

const RequestChangePasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const handleRequestChangePassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await requestChangePassword(email);
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/customer-login");
  };

  return (
    <div id="root-request-change-password">
      <LoginHeader />
      <div className="change-password-container">
        <h2>Change Your Password</h2>
        <p>We will send you an email to change your password.</p>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleRequestChangePassword}>
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
          <button type="submit" className="submit-button">
            Submit
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

export default RequestChangePasswordPage;
