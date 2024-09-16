import React from "react";
import "../../styles/onlineStoreFrontCustomersComponent/LogoutConfirmationModal.css";

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div id="root-logout-confirmation-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Confirm Logout</h2>
          <p>Are you sure you want to log out?</p>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-confirm" onClick={onConfirm}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
