import React from "react";
import "../../styles/inventoryComponents/ConfirmDeleteAllModal.css";

const ConfirmDeleteAllModal = ({
  onClose,
  onConfirm,
  confirmInput,
  setConfirmInput,
  errorMessage,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onConfirm();
    }
  };

  return (
    <div id="root-confirm-delete-all-modal">
      <div className="confirm-delete-all-modal">
        <div className="modal-content">
          <h2>Confirm Deletion</h2>
          <p>
            Type "CONFIRM DELETE ALL" to proceed with deleting all archived
            products:
          </p>
          <input
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder="Type CONFIRM DELETE ALL"
            onKeyDown={handleKeyDown}
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button className="btn-confirm" onClick={onConfirm}>
            Confirm Delete
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteAllModal;
