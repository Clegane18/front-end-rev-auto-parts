import React from "react";
import "../../styles/dashboardComponents/OrderDetailsModal.css";

const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div id="root-order-details-modal">
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <h2>Order Details - {order.orderNumber}</h2>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total Amount:</strong> ₱
            {parseFloat(order.totalAmount).toFixed(2)}
          </p>
          <p>
            <strong>Order Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <div>
            <h3>Customer Details</h3>
            <p>
              <strong>Username:</strong> {order.customer.username}
            </p>
            <p>
              <strong>Email:</strong> {order.customer.email}
            </p>
            <p>
              <strong>Phone:</strong> {order.customer.phoneNumber}
            </p>
          </div>
          <div>
            <h3>Shipping Address</h3>
            <p>
              <strong>Full Name:</strong> {order.address.fullName}
            </p>
            <p>
              <strong>Region:</strong> {order.address.region}
            </p>
            <p>
              <strong>Province:</strong> {order.address.province}
            </p>
            <p>
              <strong>City:</strong> {order.address.city}
            </p>
            <p>
              <strong>Barangay:</strong> {order.address.barangay}
            </p>
            <p>
              <strong>Postal Code:</strong> {order.address.postalCode}
            </p>
            <p>
              <strong>Address Line:</strong> {order.address.addressLine}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
