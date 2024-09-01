import React, { useContext, useEffect, useState, useCallback } from "react";
import { createOrder, calculateShippingFee } from "../../services/order-api";
import { useNavigate } from "react-router-dom";
import { getAddressById } from "../../services/address-api";
import { useAuth } from "../../contexts/AuthContext";
import { OnlineCartContext } from "../onlineStoreFrontComponents/OnlineCartContext";
import "../../styles/onlineStoreFrontComponents/OnlineCheckout.css";
import logo from "../../assets/g&f-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import AddressModal from "./AddressesModal";

const OnlineCheckout = () => {
  const { currentUser, token } = useAuth();
  const { cartItems, clearCart } = useContext(OnlineCartContext);
  const [customerId, setCustomerId] = useState("");
  const [addressId, setAddressId] = useState("");
  const [addressDetails, setAddressDetails] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const navigate = useNavigate();

  const fetchAddressDetails = useCallback(
    async (id) => {
      try {
        const response = await getAddressById({ addressId: id, token });
        setAddressDetails(response.data);

        if (response.data.isWithinMetroManila) {
          setShippingFee(0);
          setIsFreeShipping(true);
        } else {
          const shippingResponse = await calculateShippingFee({
            addressId: id,
            token,
          });
          const fee = shippingResponse.data?.data?.shippingFee || 0;
          setShippingFee(fee);
          setIsFreeShipping(false);
        }
      } catch (err) {
        setError(err.message);
      }
    },
    [token]
  );

  useEffect(() => {
    if (currentUser) {
      setCustomerId(currentUser.id);
      const validAddressId = Number(currentUser.defaultAddressId);
      if (!isNaN(validAddressId)) {
        setAddressId(validAddressId);
        fetchAddressDetails(validAddressId);
      } else {
        setError("Invalid address ID. Please update your address information.");
      }
    }
  }, [currentUser, fetchAddressDetails]);

  const handleCheckout = async () => {
    try {
      const payload = {
        customerId: Number(customerId),
        addressId: Number(addressId),
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        token,
      };

      const response = await createOrder(payload);
      const { order } = response.data;

      if (order) {
        setShippingFee(order.shippingFee || 0);
        setSuccessMessage("Order created successfully!");
        clearCart();
      } else {
        setError("Failed to retrieve order details. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const openAddressModal = () => setIsAddressModalOpen(true);
  const closeAddressModal = () => setIsAddressModalOpen(false);

  const handleAddressChange = async () => {
    try {
      const newDefaultAddressId = currentUser.defaultAddressId;
      const response = await getAddressById({
        addressId: newDefaultAddressId,
        token,
      });

      if (response.data) {
        setAddressDetails(response.data);
        setAddressId(newDefaultAddressId);

        if (response.data.isWithinMetroManila) {
          setIsFreeShipping(true);
          setShippingFee(0);
        } else {
          setIsFreeShipping(false);
          const shippingResponse = await calculateShippingFee({
            addressId: newDefaultAddressId,
            token,
          });
          const fee = shippingResponse.data?.data?.shippingFee || 0;
          setShippingFee(fee);
        }
      } else {
        setError("Failed to fetch the updated default address.");
      }
    } catch (err) {
      setError("Failed to update address. Please try again later.");
    }
  };

  const handleLogoClick = () => {
    navigate("/online-store");
  };

  const encodeURL = (url) =>
    encodeURIComponent(url).replace(/%2F/g, "/").replace(/%3A/g, ":");

  return (
    <div id="root-online-checkout">
      <div className="checkout-container">
        <header className="checkout-header">
          <div id="shop-info">
            <img
              src={logo}
              alt="G&F Auto Supply"
              id="shop-logo"
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            />
          </div>{" "}
          <div className="divider"></div>
          <h2 className="checkout-title">Checkout</h2>
        </header>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="delivery-address-section">
          <h3 className="delivery-address-title">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="delivery-icon" />{" "}
            Delivery Address
          </h3>
          {addressDetails ? (
            <p className="address-details-text">
              <strong className="space-between-phoneNo-and-addr">
                {addressDetails.fullName} {addressDetails.phoneNumber}
              </strong>
              {addressDetails.addressLine}, {addressDetails.barangay},{" "}
              {addressDetails.city}, {addressDetails.province},{" "}
              {addressDetails.region} {addressDetails.postalCode}
              <br />
              <span className="default-tag">Default</span>
              <button
                onClick={openAddressModal}
                className="change-address-link"
              >
                Change
              </button>
            </p>
          ) : (
            <p>Loading address...</p>
          )}
        </div>
        <div className="products-ordered-section">
          <div className="products-list-header">
            <span className="header-product-name">Products Ordered</span>
            <span className="header-product-price">Unit Price</span>
            <span className="header-product-quantity">Quantity</span>
            <span className="header-product-subtotal">Item Subtotal</span>
          </div>
          <ul className="products-list">
            {cartItems.map((item, index) => (
              <li key={index} className="product-item">
                <div className="product-details">
                  <div className="item-image-container">
                    <img
                      src={`http://localhost:3002/${encodeURL(
                        item.imageUrl.replace(/\\/g, "/")
                      )}`}
                      alt={item.name}
                      className="item-image"
                    />
                  </div>
                  <div className="product-info">
                    <p className="product-name">{item.name}</p>
                  </div>
                </div>
                <p className="product-price">
                  ₱{item.unitPrice ? item.unitPrice.toLocaleString() : "N/A"}
                </p>
                <p className="product-quantity">{item.quantity}</p>
                <p className="product-subtotal">
                  ₱
                  {item.unitPrice
                    ? (item.unitPrice * item.quantity).toLocaleString()
                    : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="payment-method-section">
          <div className="payment-method-header">
            <span>Payment Method</span>
            <span>Cash on Delivery</span>
            <button className="change-payment-method-link">Change</button>
          </div>
          <div className="payment-summary">
            <div className="payment-row">
              <span>Merchandise Subtotal:</span>
              <span>
                ₱
                {cartItems
                  .reduce(
                    (acc, item) => acc + (item.unitPrice || 0) * item.quantity,
                    0
                  )
                  .toLocaleString()}
              </span>
            </div>
            <div className="payment-row">
              <span>Shipping Total:</span>
              <span>
                {isFreeShipping
                  ? "Free Shipping Fee"
                  : `₱${shippingFee ? shippingFee.toLocaleString() : "0"}`}
              </span>
            </div>
            <div className="payment-row total-payment">
              <span>Total Payment:</span>
              <span>
                ₱
                {(
                  cartItems.reduce(
                    (acc, item) => acc + (item.unitPrice || 0) * item.quantity,
                    0
                  ) + (shippingFee || 0)
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="checkout-actions">
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || error}
            className="checkout-button"
          >
            Place Order
          </button>
        </div>
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={closeAddressModal}
          onAddressChange={handleAddressChange}
        />
      </div>
    </div>
  );
};

export default OnlineCheckout;
