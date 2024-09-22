import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import "../../styles/onlineStoreFrontComponents/ViewPicturesConfirmationModal.css";

const ViewPicturesConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmButtonText = "Yes",
  cancelButtonText = "No",
}) => {
  if (!isOpen) return null;

  return (
    <div id="root-view-pictures-confirmation-modal">
      <div className="confirmation-modal">
        <div className="confirmation-modal-content">
          <FaExclamationTriangle className="warning-icon" />
          <h3>{title}</h3>
          <p>{message}</p>
          <div className="confirmation-modal-actions">
            <button onClick={onConfirm} className="confirm-button">
              {confirmButtonText}
            </button>
            <button onClick={onClose} className="cancel-button">
              {cancelButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPicturesConfirmationModal;
