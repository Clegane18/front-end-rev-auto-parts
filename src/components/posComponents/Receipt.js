import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/posComponents/Receipt.css";

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleNewTransaction = () => {
    navigate("/pos");
  };

  return (
    <div className="page-container">
      <div className="receipt-container">
        <div className="store-info">
          <h2>G&F Auto Supply</h2>
          <p>1104 Gov Fortunato Halili Rd, Santa Maria, Bulacan, Philippines</p>
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
        <div className="buttons-container">
          <button className="print-button" onClick={handlePrint}>
            Print Receipt
          </button>
          <button
            className="new-transaction-button"
            onClick={handleNewTransaction}
          >
            Start New Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
