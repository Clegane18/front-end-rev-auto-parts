import React from "react";
import { FaExclamationTriangle } from "react-icons/fa"; // Importing an icon for the modal
import "../styles/LogOutConfirmationModal.css";

const LogOutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="logout-confirmation-modal">
      <div className="logout-confirmation-modal-content">
        <FaExclamationTriangle className="warning-icon" /> {/* Warning Icon */}
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out?</p>
        <div className="logout-confirmation-modal-actions">
          <button onClick={onConfirm} className="confirm-button">
            Yes
          </button>
          <button onClick={onClose} className="cancel-button">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogOutConfirmationModal;
