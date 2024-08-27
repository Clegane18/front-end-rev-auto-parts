import React from "react";
import "../../styles/inventoryComponents/ConfirmRestoreModal.css";

const ConfirmRestoreModal = ({
  product,
  onClose,
  onConfirm,
  errorMessage,
  clearErrorMessage,
}) => {
  return (
    <div id="root-confirm-restore-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="info-icon">&#8635;</div>
          <h2>Confirm Restore</h2>
          {product ? (
            <p>
              Are you sure you want to restore the product{" "}
              <strong>{product.name}</strong>?
            </p>
          ) : (
            <p>Loading...</p>
          )}
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <div className="button-group">
            <button
              className="restore-button"
              onClick={() => onConfirm(product?.id)}
              disabled={!product}
            >
              Restore
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

export default ConfirmRestoreModal;
