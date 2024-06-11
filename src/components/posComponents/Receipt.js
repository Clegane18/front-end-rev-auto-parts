import React from "react";
import "../../styles/Receipt.css";

const Receipt = ({ receipt }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="receipt-container">
      <div className="receipt-content">
        <div className="receipt-header">
          <div className="store-info">
            <h2>G&F Auto Supply</h2>
            <p>1234 Guyong, Bulacan, Philippines</p>
          </div>
        </div>
        <div className="receipt-details">
          <p>Transaction No: {receipt.transactionNo}</p>
          <p>
            Transaction Date:{" "}
            {new Date(receipt.transactionDate).toLocaleString()}
          </p>
        </div>
        <hr />
        <ul className="receipt-list">
          {receipt.items.map((item, index) => (
            <li key={index} className="receipt-list-item">
              <span className="item-name">{item.productName}</span>
              <span className="item-details">
                Qty: {item.quantity} | Price: ₱{item.unitPrice} | Subtotal: ₱
                {item.subtotalAmount}
              </span>
            </li>
          ))}
        </ul>
        <hr />
        <div className="receipt-summary">
          <p>Total Amount: ₱{receipt.totalAmount}</p>
          <p>Payment Amount: ₱{receipt.paymentAmount}</p>
          <p>Change: ₱{receipt.change}</p>
        </div>
      </div>
      <button className="print-button" onClick={handlePrint}>
        Print
      </button>
    </div>
  );
};

export default Receipt;
