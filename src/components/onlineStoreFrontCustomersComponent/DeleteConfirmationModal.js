import React from "react";
import "../../styles/onlineStoreFrontCustomersComponent/DeleteConfirmationModal.css";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-confirmation-modal">
      <div className="delete-confirmation-modal-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this address?</p>
        <div className="delete-confirmation-modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
