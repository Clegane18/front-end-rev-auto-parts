import React from "react";
import "../../styles/onlineStoreFrontComponents/WarningModal.css";

const WarningModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div id="root-warning-match-ref-no-modal">
      <div className="warning-modal-overlay">
        <div className="warning-modal-content">
          <div className="warning-icon">&#9888;</div>
          <p className="warning-note">
            Please ensure that the reference number entered is correct. Our
            admin will verify it to confirm your payment.
          </p>
          <div className="modal-actions">
            <button onClick={onClose} className="close-button">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
