import React, { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  updateOrderPaymentStatus,
  deleteOrderById,
} from "../../services/order-api";
import "../../styles/dashboardComponents/OrderList.css";
import OrderDetailsModal from "./OrderDetailsModal";
import ConfirmDeleteOrderModal from "./ConfirmDeleteOrderModal";
import CompareGCashModal from "./CompareGCashModal";
import SuccessModal from "../SuccessModal";
import { useWebSocket } from "../../contexts/WebSocketContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/g&f-logo.png";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  Visibility as EyeIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  FactCheck as FactCheckIcon,
} from "@mui/icons-material";
import { printWaybill } from "../../utils/printWaybill";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [customerReferenceNumber, setCustomerReferenceNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      await updateOrderPaymentStatus(orderId, newPaymentStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, paymentStatus: newPaymentStatus }
            : order
        )
      );
    } catch (err) {
      console.error("Failed to update order payment status:", err);
      setError("Failed to update order payment status.");
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

  const handlePrintAllWaybills = () => {
    let currentIndex = 0;

    const printNextWaybill = () => {
      if (currentIndex < orders.length) {
        const order = orders[currentIndex];
        printWaybill(order, formatCurrency);
        currentIndex++;
        setTimeout(printNextWaybill, 1000);
      }
    };

    printNextWaybill();
  };

  const openCompareModal = (order) => {
    setCustomerReferenceNumber(order.gcashReferenceNumber);
    setPaymentMethod(order.paymentMethod);
    setIsCompareModalOpen(true);
  };

  const closeCompareModal = () => {
    setIsCompareModalOpen(false);
  };

  const handleCompareSuccess = (message) => {
    setSuccessMessage(message);
    setIsSuccessModalOpen(true);
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
          <div className="button-container">
            <button
              className="print-all-button"
              onClick={handlePrintAllWaybills}
            >
              <PrintIcon /> Print All Waybills
            </button>
            <button className="refresh-button" onClick={fetchOrders}>
              <FontAwesomeIcon icon={faSync} /> Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="error-message">Error: {error}</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Order Status</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Payment Status</th>
                  <th>Payment Method</th>
                  <th>GCash Ref No.</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const normalizedPaymentMethod = order.paymentMethod
                    ? order.paymentMethod
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, "")
                    : "";

                  return (
                    <tr
                      key={order.id}
                      className={`status-${order.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
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
                      <td>{formatCurrency(order.totalAmount)}</td>
                      <td>{order.items.length} items</td>
                      <td>
                        <select
                          value={order.paymentStatus}
                          onChange={(e) =>
                            handlePaymentStatusChange(order.id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        {order.gcashReferenceNumber
                          ? order.gcashReferenceNumber
                          : "N/A"}
                      </td>

                      <td className="action-buttons">
                        <Tooltip title="View Details">
                          <IconButton
                            color="primary"
                            onClick={() => viewOrderDetails(order)}
                          >
                            <EyeIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Order">
                          <IconButton
                            color="secondary"
                            onClick={() => openDeleteModal(order)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Waybill">
                          <IconButton
                            color="default"
                            onClick={() => printWaybill(order, formatCurrency)}
                          >
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>

                        {normalizedPaymentMethod.includes("gcash") && (
                          <Tooltip title="Compare GCash Reference">
                            <IconButton
                              color="default"
                              onClick={() => openCompareModal(order)}
                            >
                              <FactCheckIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
        {isCompareModalOpen && (
          <CompareGCashModal
            isOpen={isCompareModalOpen}
            onClose={closeCompareModal}
            customerReferenceNumber={customerReferenceNumber}
            paymentMethod={paymentMethod}
            onSuccess={handleCompareSuccess}
          />
        )}
        {isSuccessModalOpen && (
          <SuccessModal
            message={successMessage}
            onClose={() => setIsSuccessModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersList;
