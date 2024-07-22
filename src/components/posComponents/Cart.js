import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import "../../styles/posComponents/Cart.css";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const handlePay = () => {
    navigate("/checkout", { state: { items: cartItems } });
  };

  const handleGoToPOS = () => {
    navigate("/pos");
  };

  const calculateSubtotal = () => {
    return cartItems
      .reduce((acc, item) => acc + item.subtotalAmount, 0)
      .toFixed(2);
  };

  return (
    <div className="cart-container">
      <h2>Your cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is currently empty.</p>
          <button className="back-to-pos-button" onClick={handleGoToPOS}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-items">
          <div className="cart-header">
            <span className="header-product">Product</span>
            <span className="header-price">Price</span>
            <span className="header-quantity">Quantity</span>
            <span className="header-total">Total</span>
          </div>
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item-details">
                <div className="item-info">
                  <span className="item-name">
                    {item.productName || item.name}
                  </span>
                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(index)}
                  >
                    Remove
                  </button>
                </div>
                <span className="item-price">
                  &#8369;{Number(item.unitPrice).toFixed(2)}
                </span>
                <div className="quantity-controls">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(index, Number(e.target.value))
                    }
                    min="1"
                  />
                </div>
                <span className="item-total">
                  &#8369;{Number(item.subtotalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <div className="subtotal-label">Subtotal:</div>
            <div className="subtotal-value">&#8369;{calculateSubtotal()}</div>
          </div>
          <div className="cart-summary-buttons">
            <button className="back-to-pos-button" onClick={handleGoToPOS}>
              Continue Shopping
            </button>
            <button className="pay-button" onClick={handlePay}>
              Check Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
