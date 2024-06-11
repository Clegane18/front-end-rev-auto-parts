import React from "react";
import "../../styles/Cart.css";

const Cart = ({ cartItems, onPay, onRemove }) => {
  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <span className="item-name">{item.productName || item.name}</span>
              {/* Assuming item.name or item.productName contains the product name */}
              <span className="item-details">
                Qty: {item.quantity} | Price: ₱
                {Number(item.unitPrice).toFixed(2)} | Subtotal: ₱
                {Number(item.subtotalAmount).toFixed(2)}
              </span>
              <button className="remove-button" onClick={() => onRemove(index)}>
                Remove
              </button>
            </div>
          ))}
          <button className="pay-button" onClick={onPay}>
            Pay
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
