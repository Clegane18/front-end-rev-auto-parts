import React, { useState, useEffect, useRef } from "react";
import "../../styles/inventoryComponents/AddProductModal.css";

const AddProductModal = ({
  onClose,
  onSave,
  errorMessage,
  clearErrorMessage,
}) => {
  const [formData, setFormData] = useState({
    category: "",
    itemCode: "",
    brand: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    supplierName: "",
    supplierCost: "",
  });

  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        clearErrorMessage();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    if (modalRef.current) {
      modalRef.current.focus();
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, clearErrorMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div id="root-add-product-modal" role="dialog" aria-modal="true">
      <div className="add-product-modal-overlay">
        <div className="add-product-modal-content" ref={modalRef} tabIndex="-1">
          <button
            className="close-button"
            onClick={() => {
              onClose();
              clearErrorMessage();
            }}
          >
            &times;
          </button>
          <h2>Add Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="itemCode">Item Code</label>
                <input
                  type="text"
                  id="itemCode"
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="supplierName">Supplier</label>
                <input
                  type="text"
                  id="supplierName"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="supplierCost">Supplier Cost</label>
                <input
                  type="number"
                  id="supplierCost"
                  name="supplierCost"
                  value={formData.supplierCost}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            {errorMessage && (
              <div className="error-message">
                <span>{errorMessage}</span>
              </div>
            )}
            <div className="modal-actions">
              <button type="submit" className="confirm-button">
                Add
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  onClose();
                  clearErrorMessage();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
