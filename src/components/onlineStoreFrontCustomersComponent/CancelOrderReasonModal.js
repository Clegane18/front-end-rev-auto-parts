import React, { useState } from "react";
import "../../styles/onlineStoreFrontCustomersComponent/CancelOrderReasonModal.css";

const CancelOrderReasonModal = ({ isOpen, onClose, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState("");

  const validReasons = [
    "Need to change delivery address",
    "Need to input/change voucher",
    "Need to modify order",
    "Payment procedure too troublesome",
    "Found cheaper elsewhere",
    "Don't want to buy anymore",
    "Others",
  ];

  const handleConfirm = () => {
    if (!selectedReason) {
      alert("Please select a reason for cancellation.");
      return;
    }
    onConfirm(selectedReason);
  };

  if (!isOpen) return null;

  return (
    <div id="root-cancel-order-reason-modal">
      <div className="cancel-order-reason-modal">
        <div className="cancel-order-reason-modal-content">
          <h2>Confirm Cancellation</h2>
          <p className="cancel-order-text">
            Please select a reason for canceling this order.
          </p>
          <select
            className="cancel-reason-select"
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
          >
            <option value="" disabled>
              Select a reason
            </option>
            {validReasons.map((reason, index) => (
              <option key={index} value={reason}>
                {reason}
              </option>
            ))}
          </select>
          <div className="cancel-order-reason-modal-actions">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="confirm-button" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderReasonModal;
