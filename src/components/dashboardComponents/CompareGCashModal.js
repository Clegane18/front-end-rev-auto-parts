import React, { useState } from "react";
import "../../styles/dashboardComponents/CompareGCashModal.css";

const CompareGCashModal = ({
  isOpen,
  onClose,
  customerReferenceNumber,
  onSuccess,
  paymentMethod,
}) => {
  const [adminReferenceNumber, setAdminReferenceNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCompare = () => {
    const normalizedPaymentMethod = paymentMethod
      ? paymentMethod.toLowerCase().replace(/[^a-z0-9]/g, "")
      : "";

    if (!normalizedPaymentMethod.includes("gcash")) {
      alert(
        "This order was not paid via GCash, so no reference number is required."
      );
      onClose();
      return;
    }

    if (adminReferenceNumber.trim() === customerReferenceNumber.trim()) {
      if (typeof onSuccess === "function") {
        onSuccess("The reference numbers match!");
      }
      onClose();
    } else {
      setErrorMessage("The reference numbers do not match.");
    }
  };

  if (!isOpen) return null;

  return (
    <div id="root-compare-gcash-modal">
      <div className="compare-gcash-modal-content">
        <h3>Compare GCash Reference Number</h3>
        <p>Please input the GCash reference number you received:</p>
        <input
          type="text"
          value={adminReferenceNumber}
          onChange={(e) => {
            setAdminReferenceNumber(e.target.value);
            setErrorMessage("");
          }}
          className="gcash-input"
          placeholder="Enter GCash Ref No."
        />
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="modal-actions">
          <button className="compare-button" onClick={handleCompare}>
            Compare
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareGCashModal;
