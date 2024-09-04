import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/order-api";
import "../../styles/dashboardComponents/OrderList.css";
import OrderDetailsModal from "./OrderDetailsModal";
import { useWebSocket } from "../../contexts/WebSocketContext";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const socket = useWebSocket();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
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

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div id="root-order-list">
      <h1>Orders List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Order Status</th>
            <th>Total</th>
            <th>Items</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.orderNumber}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.customer.username}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="To Pay">To Pay</option>
                  <option value="To Ship">To Ship</option>
                  <option value="To Receive">To Receive</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>₱{parseFloat(order.totalAmount).toFixed(2)}</td>
              <td>{order.items.length} items</td>
              <td>
                <button onClick={() => viewOrderDetails(order)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
      )}
    </div>
  );
};

export default OrdersList;
