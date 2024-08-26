import React from "react";
import "../../styles/inventoryComponents/ConfirmDeleteModal.css";

const ConfirmDeleteModal = ({
  product,
  onClose,
  onConfirm,
  errorMessage,
  clearErrorMessage,
}) => {
  return (
    <div id="root-confirm-delete-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="warning-icon">&#9888;</div>
          <h2>Are you sure?</h2>
          <p>
            All values associated with this field will be deleted{" "}
            <strong>Permanently</strong>.
          </p>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <div className="button-group">
            <button
              className="delete-button"
              onClick={() => onConfirm(product.id)}
            >
              Delete
            </button>
            <button
              className="cancel-button"
              onClick={() => {
                onClose();
                clearErrorMessage();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
