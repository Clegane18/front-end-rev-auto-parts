import React from "react";
import "../../styles/onlineStoreFrontComponents/DownpaymentModal.css";
import { formatCurrency } from "../../utils/formatCurrency";

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
          <strong>{formatCurrency(downpaymentAmount)}</strong> is required to
          reserve your item.
        </p>
        <p>
          The payment will be processed via <strong>GCash</strong>.
        </p>
        <div className="modal-actions">
          <button className="confirm-button" onClick={onConfirm}>
            Confirm & Pay
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
        <div className="modal-footer">
          <p>
            Thank you for choosing our store! We look forward to serving you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DownpaymentModal;
