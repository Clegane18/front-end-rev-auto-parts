import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnlineCartContext } from "./OnlineCartContext";
import InsufficientStockModal from "./InsufficientStockModal";
import "../../styles/onlineStoreFrontComponents/OnlineCart.css";

const OnlineCart = () => {
  const { cartItems, removeFromCart, updateQuantity } =
    useContext(OnlineCartContext);
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

  const handleGoToOnline = () => {
    navigate("/online-store");
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
  const encodeURL = (url) =>
    encodeURIComponent(url).replace(/%2F/g, "/").replace(/%3A/g, ":");

  return (
    <div id="root-online-cart">
      <div className="cart-container">
        <h2>Your cart</h2>
        {cartItems.length === 0 ||
        !cartItems.some((item) => item.quantity > 0) ? (
          <div className="empty-cart">
            <p>Your cart is currently empty.</p>
            <button
              className="back-to-online-button"
              onClick={handleGoToOnline}
            >
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
                    <div className="item-image-container">
                      <img
                        src={`http://localhost:3002/${encodeURL(
                          item.imageUrl.replace(/\\/g, "/")
                        )}`}
                        alt={item.name}
                        className="item-image"
                      />
                    </div>
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
                          handleQuantityChange(index, Number(e.target.value))
                        }
                        min="1"
                        max={item.stock}
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
              <button
                className="back-to-online-button"
                onClick={handleGoToOnline}
              >
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

export default OnlineCart;
