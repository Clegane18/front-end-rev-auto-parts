import React from "react";
import "../../styles/dashboardComponents/ConfirmToggleStatusModal.css";

const ConfirmToggleStatusModal = ({
  customer,
  onClose,
  onConfirm,
  errorMessage,
}) => {
  const actionText =
    customer.accountStatus === "Active" ? "suspend" : "activate";
  const nextStatus =
    customer.accountStatus === "Active" ? "Suspended" : "Active";

  return (
    <div id="root-confirm-toggle-status-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="warning-icon">&#9888;</div>
          <h2>Are you sure you want to {actionText} this customer?</h2>
          <p>
            Customer <strong>{customer.username}</strong> will be set to{" "}
            <strong>{nextStatus}</strong>.
          </p>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <div className="button-group">
            <button
              className="confirm-button"
              onClick={() => onConfirm(customer.id)}
            >
              Confirm
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

export default ConfirmToggleStatusModal;
