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
        <div className="modal-content waybill-style">
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <div className="header-section">
            <h2>ORDER #{order.orderNumber}</h2>
            <div className="header-info">
              <span>
                Status: <strong>{order.status}</strong>
              </span>
              <span>
                Total Amount:{" "}
                <strong>{formatCurrency(order.totalAmount)}</strong>
              </span>
              <span>
                Order Date:{" "}
                <strong>
                  {new Date(order.createdAt).toLocaleDateString()}
                </strong>
              </span>
            </div>
            <div className="pricing-details">
              <p className="merchandise-sub-total-padding-right">
                Merchandise Subtotal:{" "}
                <strong>{formatCurrency(order.merchandiseSubtotal)}</strong>
              </p>
              <p>
                Shipping Fee:{" "}
                <strong>{formatCurrency(order.shippingFee)}</strong>
              </p>
            </div>
          </div>

          <div className="items-section">
            <h3>Items Ordered</h3>
            {order.items.map((item) => (
              <div key={item.productId} className="item-row">
                <div className="item-details">
                  <span className="item-name">{item.productName}</span>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="customer-shipping-section">
            <div className="customer-details">
              <h3>Customer Details</h3>
              <p>
                Username: <strong>{order.customer.username}</strong>
              </p>
              <p>
                Email: <strong>{order.customer.email}</strong>
              </p>
              <p>
                Phone: <strong>{order.customer.phoneNumber}</strong>
              </p>
            </div>

            <div className="shipping-details">
              <h3>Shipping Address</h3>
              <p>
                Full Name: <strong>{order.address.fullName}</strong>
              </p>
              <p>
                Region: <strong>{order.address.region}</strong>
              </p>
              <p>
                Province: <strong>{order.address.province}</strong>
              </p>
              <p>
                City: <strong>{order.address.city}</strong>
              </p>
              <p>
                Barangay: <strong>{order.address.barangay}</strong>
              </p>
              <p>
                Postal Code: <strong>{order.address.postalCode}</strong>
              </p>
              <p>
                Address Line: <strong>{order.address.addressLine}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
