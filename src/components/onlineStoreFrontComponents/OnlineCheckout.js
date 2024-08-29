import React, { useContext, useEffect, useState, useCallback } from "react";
import { createOrder } from "../../services/order-api";
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

  const fetchAddressDetails = useCallback(
    async (id) => {
      try {
        const response = await getAddressById({ addressId: id, token });
        setAddressDetails(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching address details:", err);
      }
    },
    [token]
  );

  useEffect(() => {
    if (currentUser) {
      setCustomerId(currentUser.id);
      const validAddressId = Number(currentUser.defaultAddressId);
      if (isNaN(validAddressId)) {
        setError("Invalid address ID. Please update your address information.");
      } else {
        setAddressId(validAddressId);
        fetchAddressDetails(validAddressId);
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

      await createOrder(payload);
      setSuccessMessage("Order created successfully!");
      clearCart();
    } catch (err) {
      setError(err.message);
      console.error("Error during checkout:", err);
    }
  };

  const openAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
  };

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
      } else {
        setError("Failed to fetch the updated default address.");
      }
    } catch (err) {
      setError("Failed to update address. Please try again later.");
      console.error("Error fetching updated default address:", err);
    }
  };

  return (
    <div className="checkout-container">
      <header className="checkout-header">
        <img src={logo} alt="Shop Logo" className="shop-logo" />
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
          <p>
            {addressDetails.fullName} (+63) {addressDetails.phoneNumber}
            <br />
            {addressDetails.addressLine}, {addressDetails.barangay},{" "}
            {addressDetails.city}, {addressDetails.province},{" "}
            {addressDetails.region} {addressDetails.postalCode}
            <br />
            <span className="default-tag">Default</span>
            <button onClick={openAddressModal} className="change-address-link">
              Change
            </button>
          </p>
        ) : (
          <p>Loading address...</p>
        )}
      </div>

      <div className="products-ordered-section">
        <h3>Products Ordered</h3>
        <ul className="products-list">
          {cartItems.map((item, index) => (
            <li key={index} className="product-item">
              <div className="product-details">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="product-image"
                />
                <div className="product-info">
                  <p className="product-name">{item.name}</p>
                  <p className="product-price">
                    ₱{item.unitPrice.toLocaleString()}
                  </p>
                  <p className="product-quantity">Quantity: {item.quantity}</p>
                  <p className="product-subtotal">
                    Subtotal: ₱{item.subtotalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="checkout-actions">
        <button
          onClick={handleCheckout}
          disabled={cartItems.length === 0 || error}
          className="checkout-button"
        >
          Checkout
        </button>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={closeAddressModal}
        onAddressChange={handleAddressChange}
      />
    </div>
  );
};

export default OnlineCheckout;
