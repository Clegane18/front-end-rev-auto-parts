import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/dashboardComponents/OrderDetailsModal.css";
import { formatCurrency } from "../../utils/formatCurrency";
import { calculateRemainingBalance } from "../../utils/calculateRemainingBalance";

const OrderDetailsModal = ({ order, onClose }) => {
  const remainingBalance = useMemo(() => {
    if (order.paymentStatus === "Paid") {
      return 0;
    }
    return calculateRemainingBalance(order.items);
  }, [order.items, order.paymentStatus]);

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
              <p className="merchandise-subtotal">
                Merchandise Subtotal:{" "}
                <strong>{formatCurrency(order.merchandiseSubtotal)}</strong>
              </p>
              <p className="shipping-fee">
                Shipping Fee:{" "}
                <strong>{formatCurrency(order.shippingFee)}</strong>
              </p>
              {order.paymentStatus === "Paid" ? (
                <p className="remaining-balance">
                  Remaining Balance: <strong>Settled</strong>
                </p>
              ) : (
                remainingBalance > 0 && (
                  <p className="remaining-balance">
                    Remaining Balance:{" "}
                    <strong>{formatCurrency(remainingBalance)}</strong>
                  </p>
                )
              )}
            </div>
          </div>

          <div className="items-section">
            <h3>Items Ordered</h3>
            {order.items.map((item) => (
              <div key={item.productId} className="item-row">
                <div className="item-details">
                  <span className="item-name">{item.productName}</span>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                  <span className="item-purchase-method">
                    {item.purchaseMethod === "in-store-pickup"
                      ? "In-Store Pickup"
                      : "Regular"}
                  </span>
                </div>
                <div className="item-pricing">
                  <span className="item-price">
                    {formatCurrency(item.price)}
                  </span>
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
