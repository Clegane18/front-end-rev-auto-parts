import React from "react";
import "../../styles/posComponents/InsufficientModal.css";
const InsufficientModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Insufficient Payment</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default InsufficientModal;
