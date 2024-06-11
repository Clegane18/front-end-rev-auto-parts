import React, { useState, useEffect } from "react";
import "../../styles/Checkout.css";

const Checkout = ({ items, onPay, onIncreaseQuantity, onDecreaseQuantity }) => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [subtotals, setSubtotals] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const newSubtotals = {};
    let newTotalAmount = 0;
    items.forEach((item) => {
      const price = parseFloat(item.price);
      if (!isNaN(price)) {
        const subtotal = item.quantity * price;
        newSubtotals[item.id] = subtotal;
        newTotalAmount += subtotal;
      }
    });
    setSubtotals(newSubtotals);
    setTotalAmount(newTotalAmount);
  }, [items]);

  const handlePayment = () => {
    onPay(items, parseFloat(paymentAmount));
  };

  return (
    <div className="checkout-container">
      <h2>Shopping Cart</h2>
      <ul className="checkout-list">
        {items.map((item) => (
          <li key={item.id} className="checkout-list-item">
            <span>
              {item.name} - Quantity: {item.quantity} - Price: ₱
              {parseFloat(item.price).toFixed(2)}
            </span>
            {subtotals[item.id] !== undefined && (
              <span>Subtotal: ₱{subtotals[item.id].toFixed(2)}</span>
            )}
            <div className="quantity-buttons">
              <button
                className="decrease-quantity-button"
                onClick={() => onDecreaseQuantity(item.id)}
              >
                -
              </button>
              <button
                className="increase-quantity-button"
                onClick={() => onIncreaseQuantity(item.id)}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="total-amount">
        <strong>Total Amount: ₱{totalAmount.toFixed(2)}</strong>
      </div>
      <input
        type="number"
        value={paymentAmount}
        onChange={(e) => setPaymentAmount(e.target.value)}
        placeholder="Enter payment amount"
        className="payment-input"
      />
      <button onClick={handlePayment} className="pay-button">
        PA
      </button>
    </div>
  );
};

export default Checkout;
