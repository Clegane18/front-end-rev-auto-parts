import React, { useState, useEffect } from "react";
import { getOrdersByStatus, cancelOrder } from "../../services/order-api";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/onlineStoreFrontCustomersComponent/OrderTabs.css";
import { formatCurrency } from "../../utils/formatCurrency";

const OrderTabs = ({ initialTab = "All" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [toPayCount, setToPayCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser, token } = useAuth();

  const tabs = [
    "All",
    "To Pay",
    "To Ship",
    "To Receive",
    "Completed",
    "Cancelled",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const status = activeTab === "All" ? null : activeTab;
        const response = await getOrdersByStatus({
          status,
          customerId: currentUser.id,
          token,
        });

        if (response.status === 200) {
          setOrders(response.data);
          if (activeTab === "To Pay") {
            setToPayCount(response.data.length);
          }
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab, currentUser, token]);

  const onCancelOrder = async (orderId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cancelOrder({ orderId, token });
      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        );
        setToPayCount((prevCount) => prevCount - 1);
      } else {
        setError(response.message || "Failed to cancel order.");
      }
    } catch (err) {
      setError(
        err.message || "Failed to cancel order. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <div>Loading user information...</div>;
  }

  const encodeURL = (url) =>
    encodeURIComponent(url).replace(/%2F/g, "/").replace(/%3A/g, ":");

  return (
    <div id="root-order-tabs">
      <div className="order-tabs-container">
        <ul className="order-tabs">
          {tabs.map((tab) => (
            <li
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab} {tab === "To Pay" && toPayCount > 0 && `(${toPayCount})`}
            </li>
          ))}
        </ul>
        <div className="tab-content">
          {loading && <div>Loading...</div>}
          {error && <div className="error-message">{error}</div>}
          {!loading && !error && orders.length === 0 && (
            <div>No Orders Yet</div>
          )}
          {!loading && !error && orders.length > 0 && (
            <>
              {orders.map((order) => (
                <div key={order.orderId} className="order-item">
                  <div className="order-item-header">
                    <p className="text-in-my-purchases">
                      Order Total: {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-in-active-tab">
                      {activeTab === "All"
                        ? order.status || "Status Unavailable"
                        : activeTab}
                    </p>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item-details">
                        <div className="item-image-container">
                          {item.productImage ? (
                            <img
                              src={`http://localhost:3002/${encodeURL(
                                item.productImage.replace(/\\/g, "/")
                              )}`}
                              alt={item.productName}
                              className="item-image"
                            />
                          ) : (
                            <p>No image available</p>
                          )}
                        </div>
                        <div className="item-details-container">
                          <p className="text-in-my-purchases">
                            {item.productName}
                          </p>
                          <p className="text-in-my-purchases">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-actions">
                    <button className="contact-seller-btn">
                      Contact Seller
                    </button>
                    <button
                      className="cancel-order-btn"
                      onClick={() => onCancelOrder(order.orderId)}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTabs;
