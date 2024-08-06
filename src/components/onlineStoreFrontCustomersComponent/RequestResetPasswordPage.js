import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/onlineStoreFrontCustomersComponent/RequestResetPasswordPage.css";
import { requestResetPassword } from "../../services/online-store-front-customer-api";

const RequestResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRequestResetPassword = async (event) => {
    event.preventDefault();

    try {
      const response = await requestResetPassword(email);
      setMessage(response.message);
    } catch (error) {
      console.error("Error in handleRequestResetPassword:", error);
      setMessage(error.message);
    }
  };

  const handleCancel = () => {
    navigate("/customer-login");
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <p>We will send you an email to reset your password.</p>
      {message && <p>{message}</p>}
      <form onSubmit={handleRequestResetPassword}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      <button onClick={handleCancel} className="cancel-link">
        Cancel
      </button>
    </div>
  );
};

export default RequestResetPasswordPage;
