import React from "react";
import "../../styles/inventoryComponents/ConfirmCancelModal.css";

const ConfirmCancelModal = ({ onClose, onConfirm, errorMessage }) => {
  return (
    <div id="confirm-cancel-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="warning-icon">&#9888;</div>
          <h2>Are you sure?</h2>
          <p>Are you sure you want to cancel this pending stock?</p>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <div className="button-group">
            <button className="danger-button" onClick={onConfirm}>
              Cancel Stock
            </button>
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCancelModal;
