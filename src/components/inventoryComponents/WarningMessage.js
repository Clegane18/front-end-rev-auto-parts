import React from "react";
import "../../styles/inventoryComponents/WarningMessage.css";

const WarningMessage = ({ message, onClose }) => {
  return (
    <div id="root-warning-message">
      <div className="warning-modal-overlay">
        <div className="warning-modal">
          <p>{message}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default WarningMessage;
