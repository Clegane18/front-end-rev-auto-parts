import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAddresses } from "../../services/address-api";
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency } from "../../utils/formatCurrency";
import "../../styles/onlineStoreFrontComponents/OnlineCheckout.css";

const OnlineCheckout = ({ onPlaceOrder }) => {
  const location = useLocation();
  const cartItems = location.state?.items || []; // Safely access cartItems
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [paymentMethod] = useState("Cash on Delivery"); // If you're using this in the UI
  const { token } = useAuth(); // Only keeping token if it's needed for fetching addresses

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const response = await getAddresses(token);
        const defaultAddr = response.data.find(
          (address) => address.isSetDefaultAddress
        );
        setDefaultAddress(defaultAddr);
      } catch (error) {
        console.error("Failed to fetch default address:", error.message);
      }
    };

    if (token) {
      fetchDefaultAddress();
    }
  }, [token]);

  const merchandiseSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingCost = 36; // example shipping cost
  const totalPayment = merchandiseSubtotal + shippingCost;

  if (!defaultAddress) {
    return <p>Loading address...</p>;
  }

  return (
    <div className="checkout-page">
      <div className="delivery-address">
        <h2>Delivery Address</h2>
        <p>
          {defaultAddress.fullName} ({defaultAddress.phoneNumber}) <br />
          {defaultAddress.addressLine}, {defaultAddress.barangay},{" "}
          {defaultAddress.city}, {defaultAddress.province},{" "}
          {defaultAddress.region}, {defaultAddress.postalCode}
        </p>
        <button className="change-address-button">Change</button>
      </div>

      <div className="products-ordered">
        <h2>Products Ordered</h2>
        {Array.isArray(cartItems) &&
          cartItems.map((item) => (
            <div key={item.id} className="product-item">
              <div className="product-details">
                <img
                  src={`http://localhost:3002/${item.imageUrl}`}
                  alt={item.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h3>{item.name}</h3>
                  <p>{formatCurrency(item.price)}</p>
                </div>
              </div>
              <div className="product-quantity">{item.quantity}</div>
              <div className="product-subtotal">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="order-summary-details">
          <p>Merchandise Subtotal: {formatCurrency(merchandiseSubtotal)}</p>
          <p>Shipping Total: {formatCurrency(shippingCost)}</p>
          <h3>Total Payment: {formatCurrency(totalPayment)}</h3>
        </div>
        <div className="payment-method">
          <p>Payment Method: {paymentMethod}</p>
          <button className="change-payment-button">Change</button>
        </div>
      </div>

      <button className="place-order-button" onClick={onPlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default OnlineCheckout;
