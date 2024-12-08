import React from "react";
import "../../styles/inventoryComponents/DuplicateProductModal.css";

const DuplicateProductModal = ({
  onClose,
  onConfirm,
  existingProduct,
  additionalStock,
  setAdditionalStock,
  errorMessage,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleConfirm();
    }
  };

  const handleInputClick = () => {
    if (additionalStock === "0") {
      setAdditionalStock("");
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && Number(value) >= 0) {
      setAdditionalStock(value);
    }
  };

  const handleConfirm = () => {
    if (additionalStock && additionalStock !== "0") {
      onConfirm();
    }
  };

  return (
    <div id="root-duplicate-product-modal">
      <div className="duplicate-product-modal">
        <div className="modal-content">
          <h2 className="modal-title">Product Already Exists</h2>
          <p className="modal-description">
            A product with identical information already exists:
          </p>
          <div className="existing-product-details">
            <p>
              <strong>Item Code:</strong> {existingProduct.itemCode}
            </p>
            <p>
              <strong>Name:</strong> {existingProduct.name}
            </p>
            <p>
              <strong>Current Stock:</strong> {existingProduct.stock}
            </p>
          </div>
          <p className="modal-instructions">
            Do you want to add quantity to the existing product? If yes, please
            enter the quantity below:
          </p>
          <input
            type="number"
            value={additionalStock}
            onClick={handleInputClick}
            onChange={handleChange}
            placeholder="Enter additional quantity"
            className="quantity-input"
            onKeyDown={handleKeyDown}
          />
          <div className="modal-buttons">
            <button
              className="btn-confirm"
              onClick={handleConfirm}
              disabled={!additionalStock || additionalStock === "0"}
            >
              Add Quantity
            </button>
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateProductModal;
