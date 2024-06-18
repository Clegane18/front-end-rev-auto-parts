// src/components/posComponents/Receipt.js
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
      <table className="receipt-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((item, index) => (
            <tr key={index}>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>₱{formatCurrency(item.unitPrice)}</td>
              <td>₱{formatCurrency(item.subtotalAmount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
