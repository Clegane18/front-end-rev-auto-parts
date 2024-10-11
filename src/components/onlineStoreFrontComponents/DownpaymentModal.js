import React from "react";
import "../../styles/onlineStoreFrontComponents/DownpaymentModal.css";
import { formatCurrency } from "../../utils/formatCurrency";

const DownpaymentModal = ({
  isOpen,
  onClose,
  downpaymentAmount,
  remainingBalance,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div id="root-downpayment-modal" role="dialog" aria-modal="true">
      <div className="downpayment-modal-content">
        <h3>In-Store Pickup Downpayment</h3>
        <p>
          For in-store pickup, a 20% non-refundable downpayment of{" "}
          <strong>{formatCurrency(downpaymentAmount)}</strong> is required to
          reserve your item.
        </p>
        <p>
          The remaining balance of{" "}
          <strong>{formatCurrency(remainingBalance)}</strong> will need to be
          settled upon picking up your item in-store.
        </p>
        <p>
          The payment will be processed via <strong>GCash</strong>.
        </p>
        <p className="terms-conditions">
          Please pick up your item within 7 days to avoid cancellation and
          forfeiture of payment.
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
