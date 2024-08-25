import React from "react";
import "../../styles/inventoryComponents/ConfirmRestoreAllModal.css";

const ConfirmRestoreAllModal = ({
  onClose,
  onConfirm,
  confirmInput,
  setConfirmInput,
  errorMessage,
}) => {
  return (
    <div className="confirm-restore-all-modal">
      <div className="modal-content">
        <h2>Confirm Restore</h2>
        <p>
          Type "CONFIRM RESTORE ALL" to proceed with restoring all archived
          products:
        </p>
        <input
          type="text"
          value={confirmInput}
          onChange={(e) => setConfirmInput(e.target.value)}
          placeholder="Type CONFIRM RESTORE ALL"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button
          onClick={onConfirm}
          disabled={confirmInput !== "CONFIRM RESTORE ALL"}
        >
          Confirm Restore
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmRestoreAllModal;
