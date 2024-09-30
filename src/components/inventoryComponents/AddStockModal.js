import React, { useState, useEffect, useRef } from "react";
import { addToProductStock } from "../../services/inventory-api";
import "../../styles/inventoryComponents/AddStockModal.css";

const AddStockModal = ({ product, onClose, onSave }) => {
  const [quantity, setQuantity] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    if (modalRef.current) {
      modalRef.current.focus();
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      if (quantity <= 0 || isNaN(quantity)) {
        setErrorMessage("Please enter a valid quantity.");
        return;
      }

      const response = await addToProductStock(product.id, quantity);
      onSave(response.product);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div id="root-add-stock-modal">
      <div className="modal-overlay">
        <div className="modal-content" ref={modalRef} tabIndex="-1">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h2>Add Stock for {product.name}</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="quantity">Quantity to Add</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                required
                min="1"
              />
            </div>
            <div className="button-group">
              <button type="submit">Save</button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;
