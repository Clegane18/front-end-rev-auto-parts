import React, { useContext, useEffect, useState } from "react";
import { createOrder } from "../../services/order-api";
import { useAuth } from "../../contexts/AuthContext";
import { OnlineCartContext } from "../onlineStoreFrontComponents/OnlineCartContext";

const OnlineCheckout = () => {
  const { currentUser, token } = useAuth();
  const { cartItems, clearCart } = useContext(OnlineCartContext);

  const [customerId, setCustomerId] = useState("");
  const [addressId, setAddressId] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setCustomerId(currentUser.id);
      const validAddressId = Number(currentUser.defaultAddressId);
      if (isNaN(validAddressId)) {
        setError("Invalid address ID. Please update your address information.");
      } else {
        setAddressId(validAddressId);
      }
    }
  }, [currentUser]);

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

  return (
    <div>
      <h2>Checkout</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <div>
        <h3>Cart Items</h3>
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              Product ID: {item.id}, Name: {item.name}, Quantity:{" "}
              {item.quantity}, Subtotal: {item.subtotalAmount}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleCheckout}
        disabled={cartItems.length === 0 || error}
      >
        Checkout
      </button>
    </div>
  );
};

export default OnlineCheckout;
