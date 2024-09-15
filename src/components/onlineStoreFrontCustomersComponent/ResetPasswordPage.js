import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/onlineStoreFrontCustomersComponent/RequestResetPasswordPage.css";
import { resetPassword } from "../../services/online-store-front-customer-api";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (event) => {
    event.preventDefault();

    try {
      const response = await resetPassword(token, newPassword, confirmPassword);
      setMessage(response.message);
      console.log("Response:", response);
      navigate("/");
    } catch (error) {
      console.error("Error in handleResetPassword:", error);
      setMessage(error.message);
    }
  };

  return (
    <div id="root-reset-password">
      <div className="reset-password-container">
        <h2>Reset Your Password</h2>
        <p>Please set your new password.</p>
        {message && <p>{message}</p>}
        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
