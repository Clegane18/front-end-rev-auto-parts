import React, { useState } from "react";
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Product</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <label>
            Item Code:
            <input
              type="text"
              name="itemCode"
              value={formData.itemCode}
              onChange={handleChange}
            />
          </label>
          <label>
            Brand:
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            />
          </label>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </label>
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </label>
          <label>
            Stock:
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </label>
          <label>
            Supplier:
            <input
              type="text"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          <div className="button-group">
            <button type="submit">Add</button>
            <button
              type="button"
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
  );
};

export default AddProductModal;
