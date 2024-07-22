import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/posComponents/ProductDetails.css";

const ProductDetails = ({ product, onAddToCart, onClose }) => {
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleBuyNowClick = () => {
    setShowBuyNow(true);
  };

  const handleConfirmPurchaseClick = () => {
    const productWithQuantity = {
      ...product,
      quantity,
      unitPrice: product.price,
      subtotalAmount: quantity * product.price,
    };
    navigate("/checkout", { state: { items: [productWithQuantity] } });
  };

  const handleAddToCartClick = () => {
    const productWithQuantity = {
      ...product,
      quantity,
      unitPrice: product.price,
      subtotalAmount: quantity * product.price,
    };
    onAddToCart(productWithQuantity);
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="product-details-header">
          <h2>{product.name}</h2>
          <p className="product-price">₱{product.price}</p>
          <p className="product-item-code">Item Code: {product.itemCode}</p>
        </div>
        <div className="product-description">
          <p>• {product.description.split("\n").join("</p><p>• ")}</p>{" "}
        </div>
        <div className="product-actions">
          <button onClick={handleBuyNowClick} className="buy-now-button">
            Buy Now
          </button>
          <button onClick={handleAddToCartClick} className="add-to-cart-button">
            Add to Cart
          </button>
        </div>
        {showBuyNow && (
          <div className="buy-now-section">
            <p>Current Stock: {product.stock}</p>
            <label className="quantity-label">
              Quantity:
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                max={product.stock}
                className="quantity-input"
              />
            </label>
            <button
              onClick={handleConfirmPurchaseClick}
              className="confirm-buy-now-button"
            >
              Confirm Purchase
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
