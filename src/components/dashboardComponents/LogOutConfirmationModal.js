import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import "../../styles/dashboardComponents/LogOutConfirmationModal.css";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

const LogOutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  const { logout } = useAdminAuth();
  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  return (
    <div className="logout-confirmation-modal">
      <div className="logout-confirmation-modal-content">
        <FaExclamationTriangle className="warning-icon" />
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out?</p>
        <div className="logout-confirmation-modal-actions">
          <button onClick={handleLogout} className="confirm-button">
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
