import React, { useEffect, useState, useCallback } from "react";
import {
  getAllOrders,
  getAllOrdersByStatus,
  getAllOrdersByPaymentStatus,
  updateOrderStatus,
  updateOrderPaymentStatus,
  deleteOrderById,
  updateOrderETA,
} from "../../services/order-api";
import "../../styles/dashboardComponents/OrderList.css";
import OrderDetailsModal from "./OrderDetailsModal";
import ConfirmDeleteOrderModal from "./ConfirmDeleteOrderModal";
import CompareGCashModal from "./CompareGCashModal";
import SuccessModal from "../SuccessModal";
import ConfirmStatusChangeModal from "./ConfirmStatusChangeModal";
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
import EditIcon from "@mui/icons-material/Edit";
import { useLoading } from "../../contexts/LoadingContext";
import ETAModal from "./ETAModal";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [customerReferenceNumber, setCustomerReferenceNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("All");
  const [statusChangeOrder, setStatusChangeOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isETAModalOpen, setIsETAModalOpen] = useState(false);
  const [selectedOrderForETA, setSelectedOrderForETA] = useState(null);
  const { setIsLoading } = useLoading();
  const socket = useWebSocket();
  const navigate = useNavigate();
  const { authToken } = useAdminAuth();

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      let response;
      if (filterStatus === "All" && filterPaymentStatus === "All") {
        response = await getAllOrders();
      } else if (filterStatus !== "All" && filterPaymentStatus === "All") {
        response = await getAllOrdersByStatus(filterStatus);
      } else if (filterStatus === "All" && filterPaymentStatus !== "All") {
        response = await getAllOrdersByPaymentStatus(filterPaymentStatus);
      } else {
        const statusResponse = await getAllOrdersByStatus(filterStatus);
        const paymentFiltered = statusResponse.data.filter(
          (order) => order.paymentStatus === filterPaymentStatus
        );
        response = { status: 200, data: paymentFiltered };
      }
      if (response.status === 200 && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, filterPaymentStatus, setIsLoading]);

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
  }, [socket, fetchOrders]);

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const handleOpenETAModal = (order) => {
    setSelectedOrderForETA(order);
    setIsETAModalOpen(true);
  };

  const handleCloseETAModal = () => {
    setSelectedOrderForETA(null);
    setIsETAModalOpen(false);
  };

  const handleUpdateETA = async (newETA) => {
    try {
      if (!selectedOrderForETA) return;

      const { id: orderId } = selectedOrderForETA;

      const updatedOrder = await updateOrderETA(orderId, newETA, authToken);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, eta: updatedOrder.eta } : order
        )
      );

      setSuccessMessage("ETA updated successfully!");
      setIsSuccessModalOpen(true);

      handleCloseETAModal();
    } catch (err) {
      console.error("Failed to update ETA:", err);
      setError(
        err.message || "An unexpected error occurred while updating ETA."
      );
    }
  };

  const handleStatusChange = (orderId, status) => {
    const order = orders.find((o) => o.id === orderId);
    if (["Cancelled", "Completed"].includes(status)) {
      setStatusChangeOrder(order);
      setNewStatus(status);
    } else {
      updateStatus(orderId, status);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status, authToken);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
      setError("Failed to update order status.");
    }
  };

  const confirmStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      setStatusChangeOrder(null);
      setSuccessMessage("Order status updated successfully.");
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error("Failed to update order status:", err);
      setError("Failed to update order status.");
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      await updateOrderPaymentStatus(orderId, newPaymentStatus, authToken);
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
      const response = await deleteOrderById(orderId, authToken);
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
    const printWindow = window.open("", "_blank");
    const style = `
      <style>
        @page {
          size: A4;
          margin: 10mm;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .waybill {
          page-break-inside: avoid;
          margin-bottom: 20px;
        }
        .waybill h2 {
          margin-bottom: 10px;
        }
        .waybill p {
          margin: 5px 0;
        }
      </style>
    `;

    let printContent = `<html><head><title>All Waybills</title>${style}</head><body>`;

    orders.forEach((order) => {
      printContent += `
        <div class="waybill">
          <h2>Waybill for Order ${order.orderNumber}</h2>
          <p><strong>Date:</strong> ${new Date(
            order.createdAt
          ).toLocaleDateString()}</p>
          <p><strong>Customer:</strong> ${order.customer.username}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total:</strong> ${formatCurrency(order.totalAmount)}</p>
          <p><strong>Items:</strong> ${order.items.length} items</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>GCash Ref No.:</strong> ${
            order.gcashReferenceNumber || "N/A"
          }</p>
        </div>
      `;
    });

    printContent += "</body></html>";

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleFilterPaymentStatusChange = (e) => {
    setFilterPaymentStatus(e.target.value);
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

        <div className="filter-container">
          <div className="filter-group">
            <label htmlFor="statusFilter">Order Status:</label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={handleFilterStatusChange}
            >
              <option value="All">All</option>
              <option value="To Pay">To Pay</option>
              <option value="To Ship">To Ship</option>
              <option value="To Receive">To Receive</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="paymentStatusFilter">Payment Status:</label>
            <select
              id="paymentStatusFilter"
              value={filterPaymentStatus}
              onChange={handleFilterPaymentStatusChange}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        {error ? (
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

                  const isFinalized = ["Completed", "Cancelled"].includes(
                    order.status
                  );

                  return (
                    <tr
                      key={order.id}
                      className={`status-${order.status
                        .toLowerCase()
                        .replace(" ", "-")} ${
                        isFinalized ? "disabled-order" : ""
                      }`}
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
                          disabled={isFinalized}
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
                          disabled={isFinalized}
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
                            onClick={() => {
                              const printWindow = window.open("", "_blank");
                              const style = `
                                <style>
                                  @page {
                                    size: A4;
                                    margin: 10mm;
                                  }
                                  body { font-family: Arial, sans-serif; }
                                  .waybill { 
                                    page-break-inside: avoid; 
                                    margin-bottom: 20px; 
                                  }
                                  .waybill h2 { margin-bottom: 10px; }
                                  .waybill p { margin: 5px 0; }
                                </style>
                              `;
                              const printContent = `
                                <html>
                                  <head>
                                    <title>Waybill for Order ${
                                      order.orderNumber
                                    }</title>
                                    ${style}
                                  </head>
                                  <body>
                                    <div class="waybill">
                                      <h2>Waybill for Order ${
                                        order.orderNumber
                                      }</h2>
                                      <p><strong>Date:</strong> ${new Date(
                                        order.createdAt
                                      ).toLocaleDateString()}</p>
                                      <p><strong>Customer:</strong> ${
                                        order.customer.username
                                      }</p>
                                      <p><strong>Status:</strong> ${
                                        order.status
                                      }</p>
                                      <p><strong>Total:</strong> ${formatCurrency(
                                        order.totalAmount
                                      )}</p>
                                      <p><strong>Items:</strong> ${
                                        order.items.length
                                      } items</p>
                                      <p><strong>Payment Status:</strong> ${
                                        order.paymentStatus
                                      }</p>
                                      <p><strong>Payment Method:</strong> ${
                                        order.paymentMethod
                                      }</p>
                                      <p><strong>GCash Ref No.:</strong> ${
                                        order.gcashReferenceNumber || "N/A"
                                      }</p>
                                    </div>
                                  </body>
                                </html>
                              `;
                              printWindow.document.open();
                              printWindow.document.write(printContent);
                              printWindow.document.close();
                              printWindow.focus();
                              printWindow.print();
                              printWindow.close();
                            }}
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
                        {order.status === "To Ship" && (
                          <Tooltip title="Change ETA">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                handleOpenETAModal(order);
                              }}
                            >
                              <EditIcon />{" "}
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
        {statusChangeOrder && (
          <ConfirmStatusChangeModal
            order={statusChangeOrder}
            newStatus={newStatus}
            onClose={() => setStatusChangeOrder(null)}
            onConfirm={confirmStatusChange}
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
        {isETAModalOpen && selectedOrderForETA && (
          <ETAModal
            order={selectedOrderForETA}
            onClose={handleCloseETAModal}
            onUpdateETA={handleUpdateETA}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersList;
