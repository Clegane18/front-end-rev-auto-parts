import React from "react";
import "../../styles/onlineStoreFrontCustomersComponent/TermsAndConditionsModal.css";

const TermsAndConditionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div id="root-terms-confirmation-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Notice</h2>
          <p>Please agree to the terms and conditions first.</p>
          <div className="modal-actions">
            <button className="btn-confirm" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
