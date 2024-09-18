import React from "react";
import "../../styles/onlineStoreFrontComponents/DownpaymentModal.css";

const DownpaymentModal = ({
  isOpen,
  onClose,
  downpaymentAmount,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div id="root-downpayment-modal">
      <div className="downpayment-modal-content">
        <h3>In-Store Pickup Downpayment</h3>
        <p>
          For in-store pickup, a 20% non-refundable downpayment of{" "}
          <strong>{downpaymentAmount.toFixed(2)}</strong> is required to reserve
          your item.
        </p>
        <p>The payment will be processed via GCash.</p>
        <div className="modal-actions">
          <button className="confirm-button" onClick={onConfirm}>
            Confirm & Pay
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownpaymentModal;
