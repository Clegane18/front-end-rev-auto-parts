import React from "react";
import "../../styles/inventoryComponents/ConfirmDeleteAllModal.css";

const ConfirmDeleteAllModal = ({
  onClose,
  onConfirm,
  confirmInput,
  setConfirmInput,
  errorMessage,
}) => {
  return (
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
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={onConfirm}>Confirm Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmDeleteAllModal;
