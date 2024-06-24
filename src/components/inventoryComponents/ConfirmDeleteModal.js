import React from "react";
import "../../styles/inventoryComponents/ConfirmDeleteModal.css";

const ConfirmDeleteModal = ({ product, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete the product "{product.name}"?</p>
        <div className="button-group">
          <button onClick={() => onConfirm(product.id)}>Yes, Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
