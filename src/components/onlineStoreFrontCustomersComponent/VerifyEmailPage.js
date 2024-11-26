import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/onlineStoreFrontCustomersComponent/VerifyEmailPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import {
  verifyPin,
  resendPin,
} from "../../services/online-store-front-customer-api";
import { useLoading } from "../../contexts/LoadingContext";
import LoginHeader from "./LoginHeader";
import SuccessModal from "../SuccessModal";

const VerifyEmailPage = () => {
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || {};
  const [showModal, setShowModal] = useState(false);

  const handleVerifyPin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const response = await verifyPin({ email, pin });
      setMessage(response.message);
      setIsLoading(false);
      setShowModal(true);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  const handleResendPin = async () => {
    setIsLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const response = await resendPin({ email });
      setMessage(response.message);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  const buttonLabel = from === "login" ? "Send PIN" : "Resend PIN";

  return (
    <div id="root-verify-email-page">
      <LoginHeader />
      <div className="verify-email-page">
        <div className="verify-email-container">
          <h2>Email Verification</h2>
          <p className="verify-email-instructions">
            Enter your email address and the verification PIN we sent to
            proceed.
          </p>
          <form onSubmit={handleVerifyPin} className="verify-email-form">
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <div className="input-with-icon">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="pin" className="input-label">
                Verification PIN
              </label>
              <div className="input-with-icon">
                <FontAwesomeIcon icon={faKey} className="input-icon" />
                <input
                  type="text"
                  id="pin"
                  className="input-field"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
              </div>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {message && <p className="success-message">{message}</p>}
            <button type="submit" className="verify-button">
              Verify
            </button>
          </form>
          <div className="resend-pin">
            <button onClick={handleResendPin} className="resend-button">
              {buttonLabel}
            </button>
          </div>
        </div>
        <div className="login-footer">
          <p>Your security is our priority. Make sure to verify your Email.</p>
        </div>
      </div>
      {showModal && (
        <SuccessModal
          message="Your email has been successfully verified!"
          onClose={() => {
            setShowModal(false);
            navigate("/customer-login");
          }}
        />
      )}
    </div>
  );
};

export default VerifyEmailPage;
