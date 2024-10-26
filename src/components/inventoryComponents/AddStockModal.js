import React, { useState, useEffect, useRef } from "react";
import { addToProductStock } from "../../services/inventory-api";
import "../../styles/inventoryComponents/AddStockModal.css";

const AddStockModal = ({ product, onClose, onSave }) => {
  const [quantity, setQuantity] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
    if (loading) return;
    setLoading(true);
    try {
      if (quantity <= 0 || isNaN(quantity)) {
        setErrorMessage("Please enter a valid quantity.");
        setLoading(false);
        return;
      }

      const response = await addToProductStock(product.id, quantity);
      onSave(response.product);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-stock-modal" ref={modalRef} tabIndex="0">
      <form onSubmit={handleSave}>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
          />
        </label>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit" disabled={loading}>
          Add
        </button>
      </form>
    </div>
  );
};

export default AddStockModal;
