import React from "react";
import "../styles/SuccessModal.css";

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal">
        <div className="success-modal-icon">
          <svg
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="#0c619b" />
            <path
              d="M10 14.6L7.4 12L6 13.4L10 17.4L18 9.4L16.6 8L10 14.6Z"
              fill="white"
            />
          </svg>
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SuccessModal;
