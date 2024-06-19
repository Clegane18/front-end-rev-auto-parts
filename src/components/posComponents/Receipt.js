import React from "react";
import { useLocation } from "react-router-dom";
import "../../styles/Receipt.css";

const Receipt = () => {
  const location = useLocation();
  const { receipt } = location.state || {};

  if (!receipt) {
    return <div>No receipt data available.</div>;
  }

  const formatCurrency = (value) => {
    const number = Number(value);
    return isNaN(number) ? value : number.toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="receipt-container">
      <div className="store-info">
        <h2>G&F Auto Supply</h2>
        <p>1234 Guyong, Bulacan, Philippines</p>
      </div>
      <div className="receipt-header">
        <h3>Receipt</h3>
        <p>Transaction No: {receipt.transactionNo}</p>
        <p>Date: {new Date(receipt.transactionDate).toLocaleString()}</p>
      </div>
      <ul className="receipt-items">
        {receipt.items.map((item, index) => (
          <li key={index} className="item-details">
            <div className="quantity-container">
              <span>Qty:</span>
              <span>{item.quantity}</span>
            </div>
            <span className="item-name">{item.productName}</span>
            <span>Amount: ₱{formatCurrency(item.unitPrice)}</span>
            <span>Subtotal: ₱{formatCurrency(item.subtotalAmount)}</span>
          </li>
        ))}
      </ul>
      <div className="totals">
        <p>Total Amount: ₱{formatCurrency(receipt.totalAmount)}</p>
        <p>Payment Amount: ₱{formatCurrency(receipt.paymentAmount)}</p>
        <p>Change: ₱{formatCurrency(receipt.change)}</p>
      </div>
      <button className="print-button" onClick={handlePrint}>
        Print Receipt
      </button>
    </div>
  );
};

export default Receipt;
