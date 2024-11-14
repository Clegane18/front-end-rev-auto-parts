import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import "../../styles/posComponents/Receipt.css";
import { formatCurrency } from "../../utils/formatCurrency";
import { useLoading } from "../../contexts/LoadingContext";

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { receipt } = location.state || {};
  const { clearCart } = useContext(CartContext);
  const { setIsLoading } = useLoading();

  if (!receipt) {
    return <div>No receipt data available.</div>;
  }

  const handlePrint = () => {
    setIsLoading(true);
    window.print();
    setIsLoading(false);
  };

  const handleNewTransaction = () => {
    setIsLoading(true);
    clearCart();
    navigate("/pos");
    setIsLoading(false);
  };

  return (
    <div id="root-receipt">
      <div className="page-container">
        <div className="receipt-container">
          <div className="store-info">
            <h2>G&F Auto Supply</h2>
            <p>
              1104 Gov Fortunato Halili Rd, Santa Maria, Bulacan, Philippines
            </p>
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
                <span className="item-amount">
                  Amount: {formatCurrency(item.unitPrice)}
                </span>
                <span className="item-subtotal">
                  Subtotal: {formatCurrency(item.subtotalAmount)}
                </span>
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
    </div>
  );
};

export default Receipt;
