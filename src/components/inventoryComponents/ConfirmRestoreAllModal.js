import React from "react";
import "../../styles/inventoryComponents/ConfirmRestoreAllModal.css";

const ConfirmRestoreAllModal = ({
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
    <div id="root-confirm-restore-all-modal">
      <div className="confirm-restore-all-modal">
        <div className="modal-content">
          <h2>Confirm Restore All</h2>
          <p>
            Type "CONFIRM RESTORE ALL" to proceed with restoring all archived
            products:
          </p>
          <input
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder="Type CONFIRM RESTORE ALL"
            onKeyDown={handleKeyDown}
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button className="btn-confirm" onClick={onConfirm}>
            Confirm Restore
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRestoreAllModal;
