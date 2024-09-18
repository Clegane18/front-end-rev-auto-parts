import React, { useState } from "react";
import "../../styles/onlineStoreFrontComponents/GCashPaymentModal.css";
import qrCode from "../../assets/gcash-qr.jpg";

const GCashPaymentModal = ({ isOpen, onClose, onConfirm }) => {
  const [referenceNumber, setReferenceNumber] = useState("");

  const handleConfirm = () => {
    if (referenceNumber.trim()) {
      onConfirm(referenceNumber);
    } else {
      alert("Please enter the GCash reference number.");
    }
  };

  if (!isOpen) return null;

  return (
    <div id="root-gcash-payment-modal">
      <div className="gcash-modal-overlay">
        <div className="gcash-modal-content">
          <h2>Pay with GCash</h2>
          <p>Please scan the QR code below to pay the downpayment via GCash.</p>
          <div className="qr-code-container">
            <img src={qrCode} alt="GCash QR Code" />
          </div>
          <p>
            After completing the payment, enter the GCash reference number
            below:
          </p>
          <input
            type="text"
            placeholder="Enter GCash Reference Number"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            className="reference-input"
          />
          <div className="modal-actions">
            <button onClick={handleConfirm} className="confirm-button">
              Confirm Payment
            </button>
            <button onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
          <div className="modal-footer">
            <p>
              Thank you for your payment! We will process your order shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GCashPaymentModal;
