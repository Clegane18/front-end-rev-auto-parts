import React, { useState } from "react";
import { addToProductStock } from "../../services/inventory-api"; // Adjust the import path as necessary
import "../../styles/inventoryComponents/AddStockModal.css"; // Make sure you have styles defined

const AddStockModal = ({ product, onClose, onSave }) => {
  const [quantity, setQuantity] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async () => {
    try {
      if (quantity <= 0 || isNaN(quantity)) {
        setErrorMessage("Please enter a valid quantity.");
        return;
      }

      const response = await addToProductStock(product.id, quantity);
      onSave(response.product); // Pass the updated product back to the parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error adding product stock:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Stock for {product.name}</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="form-group">
          <label>Quantity to Add</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;
