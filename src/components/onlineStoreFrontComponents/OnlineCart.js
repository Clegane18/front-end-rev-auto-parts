import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InsufficientStockModal from "./InsufficientStockModal";
import "../../styles/onlineStoreFrontComponents/OnlineCart.css";
import {
  getCartItems,
  updateCartItemQuantity,
  removeProductFromCart,
} from "../../services/cart-api";
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency } from "../../utils/formatCurrency";
import OnlineStoreFrontHeader from "./OnlineStoreFrontHeader";
import OnlineStoreFrontFooter from "./OnlineStoreFrontFooter";
import { useLoading } from "../../contexts/LoadingContext";

const OnlineCart = () => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    productName: "",
    stock: 0,
  });
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const response = await getCartItems({ token });
        setCartItems(response.data.CartItems);
      } catch (error) {
        console.error("Error fetching cart:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchCart();
    }
  }, [token, setIsLoading]);

  useEffect(() => {
    const savedSelectedItems =
      JSON.parse(sessionStorage.getItem("selectedCartItems")) || [];
    setSelectedItems(savedSelectedItems);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));
  }, [selectedItems]);

  const handleQuantityChange = async (index, newQuantity) => {
    const item = cartItems[index];

    if (newQuantity > item.Product.stock) {
      setModalInfo({
        isOpen: true,
        productName: item.Product.name,
        stock: item.Product.stock,
      });
      return;
    }

    const action =
      newQuantity > item.quantity ? "increaseQuantity" : "decreaseQuantity";
    const value = Math.abs(newQuantity - item.quantity);

    try {
      setIsLoading(true);
      await updateCartItemQuantity({
        productId: item.Product.id,
        action,
        value,
        token,
      });

      const updatedItems = [...cartItems];
      updatedItems[index].quantity = newQuantity;
      updatedItems[index].subtotal =
        updatedItems[index].quantity * updatedItems[index].Product.price;
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error updating quantity:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async (index) => {
    const item = cartItems[index];

    try {
      setIsLoading(true);
      await removeProductFromCart({
        productId: item.Product.id,
        token,
      });

      const updatedItems = cartItems.filter((_, i) => i !== index);
      setCartItems(updatedItems);
      setSelectedItems(selectedItems.filter((id) => id !== item.id));
    } catch (error) {
      console.error("Error removing item:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelection = (index) => {
    const item = cartItems[index];
    let updatedSelectedItems = [];

    if (selectedItems.includes(item.id)) {
      updatedSelectedItems = selectedItems.filter((id) => id !== item.id);
    } else {
      updatedSelectedItems = [...selectedItems, item.id];
    }

    setSelectedItems(updatedSelectedItems);
  };

  const calculateSelectedSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      if (selectedItems.includes(item.id)) {
        return acc + parseFloat(item.subtotal);
      }
      return acc;
    }, 0);
  };

  const handlePay = () => {
    const validItems = cartItems.filter(
      (item) => selectedItems.includes(item.id) && item.quantity > 0
    );

    if (validItems.length > 0) {
      navigate("/online-checkout", { state: { items: validItems } });
    }
  };

  const closeModal = () => {
    setModalInfo({ isOpen: false, productName: "", stock: 0 });
  };

  const handleGoToOnline = () => {
    navigate("/");
  };

  const encodeURL = (url) =>
    encodeURIComponent(url).replace(/%2F/g, "/").replace(/%3A/g, ":");

  return (
    <div id="root-online-cart">
      <OnlineStoreFrontHeader />
      <div className="cart-container">
        <h2>Your cart</h2>
        {cartItems.length === 0 ? (
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
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-item-details">
                  <div className="item-image-container">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleToggleSelection(index)}
                      className="cart-item-checkbox"
                    />
                    <img
                      src={`https://rev-auto-parts.onrender.com/${encodeURL(
                        item.Product.images?.[0]?.imageUrl.replace(
                          /\\/g,
                          "/"
                        ) || "default-image.jpg"
                      )}`}
                      alt={item.Product?.name || "No image"}
                      className="item-image"
                    />
                  </div>
                  <div className="item-info">
                    <span className="item-name">
                      {item.Product.name}
                      <br />
                      <button
                        className="remove-button"
                        onClick={() => handleRemoveFromCart(index)}
                      >
                        Remove
                      </button>
                    </span>
                  </div>
                  <span className="item-price">
                    {formatCurrency(item.Product.price)}
                  </span>
                  <div className="quantity-controls">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, Number(e.target.value))
                      }
                      min="1"
                      max={item.Product.stock}
                    />
                  </div>
                  <span className="item-total">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              </div>
            ))}
            <div className="online-cart-bottom-section">
              <div className="cart-summary">
                <div className="subtotal-label">Selected Items Subtotal:</div>
                <div className="subtotal-value">
                  {formatCurrency(calculateSelectedSubtotal())}
                </div>
              </div>
              <div className="cart-summary-buttons">
                <button
                  className="back-to-online-button"
                  onClick={handleGoToOnline}
                >
                  Continue Shopping
                </button>
                <button
                  className="pay-button"
                  onClick={handlePay}
                  disabled={selectedItems.length === 0}
                >
                  Pay
                </button>
              </div>
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
      <OnlineStoreFrontFooter />
    </div>
  );
};

export default OnlineCart;
