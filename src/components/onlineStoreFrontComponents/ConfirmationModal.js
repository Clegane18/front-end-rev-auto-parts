import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import "../../styles/onlineStoreFrontComponents/ConfirmationModal.css";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal">
      <div className="confirmation-modal-content">
        <FaExclamationTriangle className="warning-icon" />
        <h3>Confirm {action === "publish" ? "Publish" : "Unpublish"}</h3>
        <p>
          Are you sure you want to{" "}
          {action === "publish" ? "publish" : "unpublish"}{" "}
          <strong>{itemName}</strong>?
        </p>
        <div className="confirmation-modal-actions">
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

export default ConfirmationModal;
