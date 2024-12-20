import React from "react";
import "../../styles/inventoryComponents/ProductDetailsInArchivedPage.css";
import { formatCurrency } from "../../utils/formatCurrency";

const ProductDetailsInArchivedPage = ({ product, onClose }) => {
  return (
    <div id="root-product-details-in-archived-page">
      <div className="modal">
        <div className="modal-content">
          <span className="close-button" onClick={onClose}>
            &times;
          </span>
          <h2 className="modal-title">Product Details</h2>
          <div className="product-info">
            <p>
              <strong>Product ID:</strong> {product.id}
            </p>
            <p>
              <strong>Item Code:</strong> {product.itemCode}
            </p>
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <p>
              <strong>Name:</strong> {product.name}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Description:</strong> {product.description}
            </p>
            <p>
              <strong>Supplier Name:</strong> {product.supplierName}
            </p>
            <p>
              <strong>Price:</strong> {formatCurrency(product.price)}
            </p>
            <p>
              <strong>Added Date:</strong>{" "}
              {new Date(product.dateAdded).toLocaleDateString()}
            </p>
            <p>
              <strong>Date Archived:</strong>{" "}
              {new Date(product.archivedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsInArchivedPage;
