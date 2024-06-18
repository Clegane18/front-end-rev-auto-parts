import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../../styles/Cart.css";

const Cart = ({ cartItems, onRemove, onUpdateQuantity }) => {
  const navigate = useNavigate();

  const handlePay = () => {
    navigate("/checkout", { state: { items: cartItems } });
  };

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
              <span className="item-details">
                Qty: {item.quantity} | Price: ₱
                {Number(item.unitPrice).toFixed(2)} | Subtotal: ₱
                {Number(item.subtotalAmount).toFixed(2)}
              </span>
              <div className="quantity-controls">
                <button onClick={() => onUpdateQuantity(index, -1)}>
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <button onClick={() => onUpdateQuantity(index, 1)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <button className="remove-button" onClick={() => onRemove(index)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
          <button className="pay-button" onClick={handlePay}>
            Pay
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
