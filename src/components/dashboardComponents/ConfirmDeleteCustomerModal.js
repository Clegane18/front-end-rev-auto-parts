import React from "react";
import "../../styles/dashboardComponents/ConfirmDeleteCustomerModal.css";

const ConfirmDeleteCustomerModal = ({
  customer,
  onClose,
  onConfirm,
  errorMessage,
}) => {
  return (
    <div id="root-confirm-delete-customer-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="warning-icon">&#9888;</div>
          <h2>Are you sure you want to delete this customer?</h2>
          <p>
            Customer <strong>{customer.username}</strong> will be deleted
            <strong> permanently</strong>.
          </p>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <div className="button-group">
            <button
              className="delete-button"
              onClick={() => onConfirm(customer.id)}
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

export default ConfirmDeleteCustomerModal;
