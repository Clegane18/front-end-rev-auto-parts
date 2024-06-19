import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { buyProductsOnPhysicalStore } from "../../services/pos-api";
import "../../styles/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = location.state || { items: [] };
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const total = items.reduce(
      (sum, item) => sum + Number(item.subtotalAmount),
      0
    );
    setTotalAmount(total);
  }, [items]);

  const handlePaymentAmountChange = (e) => {
    setPaymentAmount(Number(e.target.value));
  };

  const handlePay = async () => {
    const payload = {
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      paymentAmount,
    };

    try {
      const response = await buyProductsOnPhysicalStore(payload);
      if (response.receipt) {
        navigate("/receipt", { state: { receipt: response.receipt } });
      } else {
        alert("No receipt data received from the server.");
      }
    } catch (error) {
      console.error("Payment failed", error);
      alert(
        `Payment failed: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {items.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <>
          <ul>
            {items.map((item, index) => (
              <li key={index} className="item-details">
                <div className="quantity-container">
                  <span>Qty:</span>
                  <span>{item.quantity}</span>
                </div>
                <span>{item.productName || item.name}</span>
                <span>Amount: ₱{item.unitPrice}</span>
                <span>Subtotal: ₱{item.subtotalAmount}</span>
              </li>
            ))}
          </ul>
          <div className="total-amount">Total Amount: ₱{totalAmount}</div>
          <div className="payment-section">
            <label>
              Payment Amount: ₱
              <input
                type="number"
                value={paymentAmount}
                onChange={handlePaymentAmountChange}
                min="0"
              />
            </label>
            <button onClick={handlePay}>Pay</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
