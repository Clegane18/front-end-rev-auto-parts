import React, { useState } from "react";
import "../../styles/ProductDetails.css";

const ProductDetails = ({ product, onAddToCart }) => {
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleBuyNowClick = () => {
    setShowBuyNow(true);
  };

  const handleAddToCartClick = () => {
    const productWithQuantity = { ...product, quantity };
    onAddToCart(productWithQuantity);
    setShowBuyNow(false); // Close the buy now section after adding to cart
  };

  return (
    <div className="product-details">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ₱{product.price}</p>
      <p>Item Code: {product.itemCode}</p>
      <button
        onClick={() => onAddToCart({ ...product, quantity: 1 })}
        className="add-to-cart-button"
      >
        Add to Cart
      </button>
      <button onClick={handleBuyNowClick} className="buy-now-button">
        Buy Now
      </button>
      {showBuyNow && (
        <div className="buy-now-section">
          <p>Current Stock: {product.stock}</p>
          <label>
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              max={product.stock}
            />
          </label>
          <button
            onClick={handleAddToCartClick}
            className="confirm-buy-now-button"
          >
            Confirm Purchase
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
