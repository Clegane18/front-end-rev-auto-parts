import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/dashboardComponents/OrderDetailsModal.css";
import { formatCurrency } from "../../utils/formatCurrency";

const OrderDetailsModal = ({ order, onClose }) => {
  const handleClickOutside = (e) => {
    if (e.target.className === "modal") {
      onClose();
    }
  };

  return (
    <div id="root-order-details-modal">
      <div className="modal" onClick={handleClickOutside}>
        <div className="modal-content modern">
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2>Order #{order.orderNumber}</h2>

          <div className="details-section">
            <p>
              <span>Status:</span> {order.status}
            </p>
            <p>
              <span>Total Amount:</span> {formatCurrency(order.totalAmount)}
            </p>

            <p>
              <span>Order Date:</span>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="details-section">
            <div className="details-column">
              <h3>Customer Details</h3>
              <p>
                <span>Username:</span> {order.customer.username}
              </p>
              <p>
                <span>Email:</span> {order.customer.email}
              </p>
              <p>
                <span>Phone:</span> {order.customer.phoneNumber}
              </p>
            </div>

            <div className="details-column">
              <h3>Shipping Address</h3>
              <p>
                <span>Full Name:</span> {order.address.fullName}
              </p>
              <p>
                <span>Region:</span> {order.address.region}
              </p>
              <p>
                <span>Province:</span> {order.address.province}
              </p>
              <p>
                <span>City:</span> {order.address.city}
              </p>
              <p>
                <span>Barangay:</span> {order.address.barangay}
              </p>
              <p>
                <span>Postal Code:</span> {order.address.postalCode}
              </p>
              <p>
                <span>Address Line:</span> {order.address.addressLine}
              </p>
            </div>
          </div>

          <div className="details-section order-items">
            <h3>Items Ordered</h3>
            {order.items.map((item) => (
              <div key={item.productId} className="order-item">
                <p>
                  <span>Product:</span> {item.productName}
                </p>
                <p>
                  <span>Quantity:</span> {item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
