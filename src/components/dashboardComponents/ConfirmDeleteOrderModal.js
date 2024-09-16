import React from "react";
import "../../styles/dashboardComponents/ConfirmDeleteOrderModal.css";

const ConfirmDeleteOrderModal = ({
  order,
  onClose,
  onConfirm,
  errorMessage,
}) => {
  return (
    <div id="root-confirm-delete-order-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="warning-icon">&#9888;</div>
          <h2>Are you sure you want to delete this order?</h2>
          <p>
            Order <strong>#{order.orderNumber}</strong> will be deleted
            <strong> permanently</strong>.
          </p>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <div className="button-group">
            <button
              className="delete-button"
              onClick={() => onConfirm(order.id)}
            >
              Delete
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

export default ConfirmDeleteOrderModal;
