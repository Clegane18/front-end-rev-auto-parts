import React, { useState } from "react";
import { addToProductStock } from "../../services/inventory-api";
import "../../styles/inventoryComponents/AddStockModal.css";

const AddStockModal = ({ product, onClose, onSave }) => {
  const [quantity, setQuantity] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      if (quantity <= 0 || isNaN(quantity)) {
        setErrorMessage("Please enter a valid quantity.");
        return;
      }

      const response = await addToProductStock(product.id, quantity);
      onSave(response.product);
      onClose();
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
        <form onSubmit={handleSave}>
          <label>Quantity to Add</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
          <div className="button-group">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal;
