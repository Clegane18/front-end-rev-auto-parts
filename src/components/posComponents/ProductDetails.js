import React from "react";
import "../../styles/ProductDetails.css";

const ProductDetails = ({ product, onAddToCart }) => {
  return (
    <div className="product-details">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ₱{product.price}</p>
      <p>Item Code: {product.itemCode}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="add-to-cart-button"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
