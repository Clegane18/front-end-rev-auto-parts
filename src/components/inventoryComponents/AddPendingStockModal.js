import React from "react";
import "../../styles/inventoryComponents/AddPendingStockModal.css";

const AddPendingStockModal = ({ onClose }) => {
  return (
    <div id="add-pending-stock-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="warning-icon">&#9888;</div>
          <h2>Incomplete Information</h2>
          <p>Please fill in all the required fields to add a pending stock.</p>
          <div className="button-group">
            <button className="primary-button" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPendingStockModal;
