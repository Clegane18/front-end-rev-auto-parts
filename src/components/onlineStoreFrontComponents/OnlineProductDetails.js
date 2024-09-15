import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import InsufficientStockModal from "./InsufficientStockModal";
import "../../styles/onlineStoreFrontComponents/OnlineProductDetails.css";
import { formatCurrency } from "../../utils/formatCurrency";
import useRequireAuth from "../../utils/useRequireAuth";
import { addProductToCart } from "../../services/cart-api";
import { useAuth } from "../../contexts/AuthContext";

const OnlineProductDetails = ({ product, onClose, onCartUpdate }) => {
  const checkAuth = useRequireAuth();
  const { currentUser, token } = useAuth();
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    productName: "",
    stock: 0,
  });
  const navigate = useNavigate();

  const handleBuyNowClick = () => {
    if (checkAuth("/online-store")) {
      setShowBuyNow(true);
    }
  };

  const handleConfirmPurchaseClick = useCallback(() => {
    if (!checkAuth("/online-store")) return;
    if (quantity > product.stock) {
      setModalInfo({
        isOpen: true,
        productName: product.name,
        stock: product.stock,
      });
      return;
    }

    const productWithQuantity = {
      Product: { ...product },
      quantity,
      unitPrice: product.price,
      subtotalAmount: quantity * product.price,
    };
    navigate("/online-checkout", { state: { items: [productWithQuantity] } });
  }, [checkAuth, quantity, product, navigate]);

  const handleAddToCartClick = useCallback(async () => {
    if (!checkAuth("/online-store")) return;
    if (quantity > product.stock) {
      setModalInfo({
        isOpen: true,
        productName: product.name,
        stock: product.stock,
      });
      return;
    }

    try {
      await addProductToCart({
        customerId: currentUser.id,
        productId: product.id,
        token,
      });

      onClose();

      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [
    checkAuth,
    quantity,
    product,
    currentUser.id,
    token,
    onClose,
    onCartUpdate,
  ]);

  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    if (newQuantity > product.stock) {
      setModalInfo({
        isOpen: true,
        productName: product.name,
        stock: product.stock,
      });
      setQuantity(product.stock);
    } else {
      setQuantity(newQuantity);
    }
  };

  const closeModal = () => {
    setModalInfo({ isOpen: false, productName: "", stock: 0 });
  };

  return (
    <div id="root-product-details">
      <div className="product-modal-overlay" onClick={onClose}>
        <div className="product-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
          <div className="product-details-header">
            <h2>{product.name}</h2>
            <p className="product-price">{formatCurrency(product.price)}</p>
            <p className="product-item-code">ITEM CODE: {product.itemCode}</p>
          </div>
          <div className="product-description">
            <p>
              •{" "}
              {product.description
                ? product.description.split("\n").join("</p><p>• ")
                : "No description available"}
            </p>
          </div>
          <div className="product-actions">
            <button onClick={handleBuyNowClick} className="buy-now-button">
              Buy Now
            </button>
            <button
              onClick={handleAddToCartClick}
              className="add-to-cart-button"
            >
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
                  onChange={handleQuantityChange}
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
      <InsufficientStockModal
        isOpen={modalInfo.isOpen}
        productName={modalInfo.productName}
        stock={modalInfo.stock}
        onClose={closeModal}
      />
    </div>
  );
};

export default OnlineProductDetails;
