import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { getCustomerOnlinePurchaseHistory } from "../../services/online-store-front-customer-api";
import "../../styles/dashboardComponents/PurchaseHistoryModal.css";
import { formatCurrency } from "../../utils/formatCurrency";

const PurchaseHistoryModal = ({ customerId, onClose }) => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await getCustomerOnlinePurchaseHistory(customerId);
        setPurchaseHistory(response.data);
        setLoading(false);
      } catch (error) {
        setError("No purchase history found for this customer.");
        setLoading(false);
      }
    };

    if (customerId) {
      fetchPurchaseHistory();
    }
  }, [customerId]);

  const handleClickOutside = (e) => {
    if (e.target.className === "modal") {
      onClose();
    }
  };

  return (
    <div id="root-purchase-history-modal">
      <div className="modal" onClick={handleClickOutside}>
        <div className="modal-content purchase-history-style">
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <div className="header-section">
            <h2>Purchase History</h2>
          </div>

          <div className="content-section">
            {loading ? (
              <div className="loading-message">Loading...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : purchaseHistory.length === 0 ? (
              <div className="no-history-message">
                No purchase history found.
              </div>
            ) : (
              purchaseHistory.map((order, index) => (
                <div key={index} className="purchase-history-item">
                  <p>
                    <strong>Order No:</strong> {order.orderNumber}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total Amount:</strong>{" "}
                    {formatCurrency(order.totalAmount)}
                  </p>
                  <div className="items-white-container">
                    <p>
                      <strong>Items:</strong>
                    </p>
                    <ul className="purchase-items-list">
                      {order.OrderItems.map((item, idx) => (
                        <li key={idx}>
                          <strong>Product:</strong> {item.Product.name} <br />
                          <strong>Quantity:</strong> {item.quantity} <br />
                          <strong>Total Price:</strong>{" "}
                          {formatCurrency(item.quantity * item.price)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <hr />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistoryModal;
