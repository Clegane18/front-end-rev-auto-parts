import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import InsufficientStockModal from "./InsufficientStockModal";
import "../../styles/posComponents/Cart.css";
import { formatCurrency } from "../../utils/formatCurrency";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    productName: "",
    stock: 0,
  });

  const handlePay = () => {
    const validItems = cartItems.filter((item) => item.quantity > 0);
    navigate("/checkout", { state: { items: validItems } });
  };

  const handleGoToPOS = () => {
    navigate("/pos");
  };

  const calculateSubtotal = () => {
    return cartItems
      .filter((item) => item.quantity > 0)
      .reduce((acc, item) => acc + item.subtotalAmount, 0)
      .toFixed(2);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const item = cartItems[index];
    if (newQuantity > item.stock) {
      setModalInfo({
        isOpen: true,
        productName: item.productName || item.name,
        stock: item.stock,
      });
      return;
    }
    updateQuantity(index, newQuantity);
  };

  const closeModal = () => {
    setModalInfo({ isOpen: false, productName: "", stock: 0 });
  };

  return (
    <div id="root-cart">
      <div className="cart-container">
        <h2>Your cart</h2>
        {cartItems.length === 0 ||
        !cartItems.some((item) => item.quantity > 0) ? (
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
            {cartItems
              .filter((item) => item.quantity > 0)
              .map((item, index) => (
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
                      {formatCurrency(item.unitPrice)}
                    </span>
                    <div className="quantity-controls">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, Number(e.target.value))
                        }
                        min="1"
                        max={item.stock}
                      />
                    </div>
                    <span className="item-total">
                      {formatCurrency(item.subtotalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            <div className="cart-summary">
              <div className="subtotal-label">Subtotal:</div>
              <div className="subtotal-value">
                {formatCurrency(calculateSubtotal())}
              </div>
            </div>
            <div className="cart-summary-buttons">
              <button className="back-to-pos-button" onClick={handleGoToPOS}>
                Continue Shopping
              </button>
              <button className="pay-button" onClick={handlePay}>
                Pay
              </button>
            </div>
          </div>
        )}
      </div>
      <InsufficientStockModal
        isOpen={modalInfo.isOpen}
        productName={modalInfo.productName}
        stock={modalInfo.stock}
        onClose={closeModal}
      />
    </div>
  );
};

export default Cart;
