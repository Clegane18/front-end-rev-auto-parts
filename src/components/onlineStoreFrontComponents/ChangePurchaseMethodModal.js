import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import "../../styles/onlineStoreFrontComponents/ChangePurchaseMethodModal.css";

const ChangePurchaseMethodModal = ({
  isOpen,
  onClose,
  onConfirm,
  newMethod,
  currentMethod,
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <div id="root-change-purchase-method-modal">
      <div className="confirmation-modal">
        <div className="confirmation-modal-content">
          <FaExclamationTriangle className="warning-icon" />
          <h3>Confirm Purchase Method Change</h3>
          <p>
            You are about to change the purchase method from{" "}
            <strong>{currentMethod}</strong> to <strong>{newMethod}</strong> for{" "}
            <strong>{itemName}</strong>.
          </p>
          <p>Are you sure you want to proceed with this change?</p>
          <div className="confirmation-modal-actions">
            <button onClick={onConfirm} className="confirm-button">
              Yes, Change
            </button>
            <button onClick={onClose} className="cancel-button">
              No, Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePurchaseMethodModal;
