import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import "../../styles/dashboardComponents/AccountSuspended.css";

const AccountSuspended = () => {
  const navigate = useNavigate();

  return (
    <div id="root-account-suspended-page" className="account-suspended-page">
      <div className="suspended-container">
        <div className="suspended-card">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size="4x"
            className="suspended-icon"
          />
          <h1>Your Account Has Been Suspended</h1>
          <p>
            Please contact our support team if you believe this is a mistake or
            if you need assistance to resolve the issue.
          </p>
          <button
            className="contact-support-btn"
            onClick={() => navigate("/contact-us")}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSuspended;
