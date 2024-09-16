import React, { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrderById,
} from "../../services/order-api";
import "../../styles/dashboardComponents/OrderList.css";
import OrderDetailsModal from "./OrderDetailsModal";
import ConfirmDeleteOrderModal from "./ConfirmDeleteOrderModal";
import { useWebSocket } from "../../contexts/WebSocketContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/g&f-logo.png";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const socket = useWebSocket();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      if (response.status === 200 && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        throw new Error("Data is not an array or bad API response");
      }
      setLoading(false);
    } catch (err) {
      console.error("Fetching orders failed:", err);
      setError(err.toString());
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (socket) {
      socket.on("orderStatusUpdated", ({ orderId, newStatus }) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("orderStatusUpdated");
      }
    };
  }, [socket]);

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
      setError("Failed to update order status.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await deleteOrderById(orderId);
      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        setOrderToDelete(null);
      } else {
        setDeleteError(response.message);
      }
    } catch (err) {
      setDeleteError("Failed to delete order.");
    }
  };

  const openDeleteModal = (order) => {
    setOrderToDelete(order);
  };

  const closeDeleteModal = () => {
    setOrderToDelete(null);
    setDeleteError(null);
  };

  return (
    <div id="root-order-list">
      <div className="order-list-container">
        <div className="header">
          <div className="header-left">
            <img
              src={logo}
              alt="Back"
              className="logo-back-button"
              onClick={() => navigate("/dashboard")}
            />
            <h1>Orders List</h1>
          </div>
          <button className="refresh-button" onClick={fetchOrders}>
            <FontAwesomeIcon icon={faSync} /> Refresh
          </button>
        </div>
        {loading ? (
          <div className="loading-spinner">
            <img src="/assets/spinner.gif" alt="Loading..." />
          </div>
        ) : error ? (
          <div className="error-message">Error: {error}</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Order Number</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Order Status</th>
                  <th>Merchandise Subtotal</th>
                  <th>Shipping Fee</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className={`status-${order.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    <td>{order.id}</td>
                    <td>{order.orderNumber}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.customer.username}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        <option value="To Pay">To Pay</option>
                        <option value="To Ship">To Ship</option>
                        <option value="To Receive">To Receive</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{formatCurrency(order.merchandiseSubtotal)}</td>
                    <td>{formatCurrency(order.shippingFee)}</td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>{order.items.length} items</td>
                    <td>
                      <button
                        className="view-details-button"
                        onClick={() => viewOrderDetails(order)}
                      >
                        <FontAwesomeIcon icon={faEye} /> View Details
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => openDeleteModal(order)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedOrder && (
          <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
        )}
        {orderToDelete && (
          <ConfirmDeleteOrderModal
            order={orderToDelete}
            onClose={closeDeleteModal}
            onConfirm={handleDeleteOrder}
            errorMessage={deleteError}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersList;
