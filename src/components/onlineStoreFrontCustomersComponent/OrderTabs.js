import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrdersByStatus, cancelOrder } from "../../services/order-api";
import { useAuth } from "../../contexts/AuthContext";
import { useWebSocket } from "../../contexts/WebSocketContext";
import "../../styles/onlineStoreFrontCustomersComponent/OrderTabs.css";
import { formatCurrency } from "../../utils/formatCurrency";
import RatingModal from "./RatingModal";
import SuccessModal from "../SuccessModal";
import { useLoading } from "../../contexts/LoadingContext";
import { calculateRemainingBalance } from "../../utils/calculateRemainingBalance";
import CancelOrderReasonModal from "./CancelOrderReasonModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";

const OrderTabs = ({ initialTab = "All" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [allCount, setAllCount] = useState(0);
  const [toPayCount, setToPayCount] = useState(0);
  const [toShipCount, setToShipCount] = useState(0);
  const [toReceiveCount, setToReceiveCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [error, setError] = useState(null);
  const { currentUser, token } = useAuth();
  const socket = useWebSocket();
  const { setIsLoading } = useLoading();
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const tabs = [
    "All",
    "To Pay",
    "To Ship",
    "To Receive",
    "Completed",
    "Cancelled",
  ];

  const setCounts = (updatedOrders) => {
    setAllCount(updatedOrders.length);
    setToPayCount(
      updatedOrders.filter((order) => order.status === "To Pay").length
    );
    setToShipCount(
      updatedOrders.filter((order) => order.status === "To Ship").length
    );
    setToReceiveCount(
      updatedOrders.filter((order) => order.status === "To Receive").length
    );
    setCompletedCount(
      updatedOrders.filter((order) => order.status === "Completed").length
    );
    setCancelledCount(
      updatedOrders.filter((order) => order.status === "Cancelled").length
    );
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        return;
      }

      setIsLoading(true);
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
          setCounts(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

    if (socket) {
      socket.on("orderStatusUpdated", ({ orderId, newStatus }) => {
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          );
          setCounts(updatedOrders);
          return updatedOrders;
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("orderStatusUpdated");
      }
    };
  }, [activeTab, currentUser, token, socket, setIsLoading]);

  const handleOpenCancelModal = (orderId) => {
    if (!orderId) {
      console.error("Order ID is undefined");
      return;
    }
    setSelectedOrderId(orderId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancellation = async (reason) => {
    try {
      await cancelOrder({
        token,
        orderId: selectedOrderId,
        cancellationReason: reason,
      });

      setCancelModalOpen(false);
      setSelectedOrderId(null);

      setSuccessMessage("Order canceled successfully!");
      setIsSuccessModalOpen(true);

      const updatedOrders = await getOrdersByStatus(activeTab);
      setOrders(updatedOrders);
    } catch (error) {
      setSuccessMessage("Failed to cancel order. Please try again.");
      setIsSuccessModalOpen(true);
    }
  };

  const openRatingModal = (orderId, product) => {
    setSelectedProduct({ orderId, ...product });
    setIsRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setSelectedProduct(null);
    setIsRatingModalOpen(false);
  };

  const handleRatingSubmit = (newCommentData) => {
    const { orderId, productId } = selectedProduct;
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.orderId === orderId) {
          return {
            ...order,
            items: order.items.map((item) =>
              item.productId === productId
                ? { ...item, hasCommented: true }
                : item
            ),
          };
        }
        return order;
      })
    );
    setSuccessMessage("Review submitted successfully!");
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
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
          {tabs.map((tab) => {
            let count = 0;
            if (tab === "All") count = allCount;
            if (tab === "To Pay") count = toPayCount;
            if (tab === "To Ship") count = toShipCount;
            if (tab === "To Receive") count = toReceiveCount;
            if (tab === "Completed") count = completedCount;
            if (tab === "Cancelled") count = cancelledCount;

            return (
              <li
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab} {count > 0 && `(${count})`}
              </li>
            );
          })}
        </ul>
        <div className="tab-content">
          {error && <div className="error-message">{error}</div>}
          {!error && orders.length === 0 && <div>No Orders Yet</div>}
          {!error && orders.length > 0 && (
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
                              src={`https://rev-auto-parts.onrender.com/${encodeURL(
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
                          <p className="quantity">Quantity: {item.quantity}</p>
                          {item.purchaseMethod === "in-store-pickup" && (
                            <>
                              <p className="pickup-message">{order.message}</p>
                              <p className="remaining-balance-message">
                                and prepare the remaining amount of:{" "}
                                <span className="bold">
                                  {formatCurrency(
                                    calculateRemainingBalance([item])
                                  )}
                                </span>{" "}
                                for in-store pickup.
                              </p>
                            </>
                          )}
                        </div>
                        {activeTab === "Completed" && !item.hasCommented && (
                          <div className="rate-product-container">
                            <button
                              className="rate-product-button"
                              onClick={() =>
                                openRatingModal(order.orderId, {
                                  productId: item.productId,
                                  productName: item.productName,
                                })
                              }
                            >
                              Rate Product
                            </button>
                          </div>
                        )}
                        {activeTab === "Completed" && item.hasCommented && (
                          <p className="already-rated-text">Already Rated</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="order-actions">
                    {(order.status === "To Ship" ||
                      order.status === "To Receive") && (
                      <p className="order-eta">
                        <Tooltip title="The ETA may take longer if there are external factors, such as weather conditions or holidays.">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="payment-note-icon"
                          />
                        </Tooltip>{" "}
                        ETA: {order.eta}
                      </p>
                    )}

                    <p className="order-id">
                      Order ID:{" "}
                      <span className="bold">{order.orderNumber}</span>
                    </p>
                    <Link to="/contact-us" className="contact-seller-btn">
                      Contact Seller
                    </Link>
                    {activeTab === "To Pay" && (
                      <button
                        className="cancel-order-btn"
                        onClick={() => handleOpenCancelModal(order.orderId)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <CancelOrderReasonModal
        isOpen={isCancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancellation}
      />

      {selectedProduct && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={closeRatingModal}
          product={selectedProduct}
          onSubmit={handleRatingSubmit}
        />
      )}

      {isSuccessModalOpen && (
        <SuccessModal message={successMessage} onClose={closeSuccessModal} />
      )}
    </div>
  );
};

export default OrderTabs;
