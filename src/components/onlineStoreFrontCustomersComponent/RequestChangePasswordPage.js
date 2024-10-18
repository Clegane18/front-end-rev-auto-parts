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
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const handleRequestChangePassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus("loading");
    try {
      const response = await requestChangePassword(email);
      if (response.status === 200) {
        setStatus("success");
        setMessage(
          "We've sent a password change link to your email. Please check your inbox and follow the instructions to change your password. After changing, you can safely close this tab."
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
    <div id="root-request-change-password">
      <LoginHeader />
      <div className="change-password-container">
        <h2>Change Your Password</h2>
        <p>We will send you an email to change your password.</p>

        {status === "success" ? (
          <div className="confirmation-message">
            <p>{message}</p>
          </div>
        ) : (
          <>
            {message && status === "error" && (
              <p className="message error">{message}</p>
            )}
            <form onSubmit={handleRequestChangePassword}>
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
                {status === "loading" ? "Sending..." : "Send Change Link"}
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
          Your security is our priority. Make sure to choose a strong password
          to protect your account.
        </p>
      </div>
    </div>
  );
};

export default RequestChangePasswordPage;
