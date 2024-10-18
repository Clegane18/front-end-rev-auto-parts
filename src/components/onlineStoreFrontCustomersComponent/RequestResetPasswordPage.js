import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/onlineStoreFrontCustomersComponent/RequestResetPasswordPage.css";
import { requestResetPassword } from "../../services/online-store-front-customer-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import LoginHeader from "./LoginHeader";
import { useLoading } from "../../contexts/LoadingContext";

const RequestResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const handleRequestResetPassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus("loading");
    try {
      const response = await requestResetPassword(email);
      if (response.status === 200) {
        setStatus("success");
        setMessage(
          "We've sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password. After resetting, you can safely close this tab."
        );
      } else {
        setStatus("error");
        setMessage(response.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/customer-login");
  };

  return (
    <div id="root-request-reset-password">
      <LoginHeader />
      <div className="reset-password-container">
        <h2>Reset Your Password</h2>
        <p>We will send you an email to reset your password.</p>

        {status === "success" ? (
          <div className="confirmation-message">
            <p>{message}</p>
          </div>
        ) : (
          <>
            {message && status === "error" && (
              <p className="message error">{message}</p>
            )}
            <form onSubmit={handleRequestResetPassword}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <div className="input-icon">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="input-field-icon"
                  />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="submit-button"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <button onClick={handleCancel} className="cancel-link">
              Cancel
            </button>
          </>
        )}
      </div>
      <div className="login-footer">
        <p>
          We're glad to see you! Let’s get started and enjoy a seamless shopping
          experience.
        </p>
      </div>
    </div>
  );
};

export default RequestResetPasswordPage;
