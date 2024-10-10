import React, { useEffect, useState, useCallback, useMemo } from "react";
import { createOrder, calculateShippingFee } from "../../services/order-api";
import { useNavigate, useLocation } from "react-router-dom";
import { getAddressById } from "../../services/address-api";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/onlineStoreFrontComponents/OnlineCheckout.css";
import logo from "../../assets/g&f-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import AddressModal from "./AddressesModal";
import DownpaymentModal from "./DownpaymentModal";
import GCashPaymentModal from "./GCashPaymentModal";
import WarningModal from "./WarningModal";
import { formatCurrency } from "../../utils/formatCurrency";

const OnlineCheckout = () => {
  const { currentUser, token } = useAuth();
  const [customerId, setCustomerId] = useState("");
  const [addressId, setAddressId] = useState("");
  const [addressDetails, setAddressDetails] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [isDownpaymentModalOpen, setIsDownpaymentModalOpen] = useState(false);
  const [downpaymentAmount, setDownpaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [isGCashModalOpen, setIsGCashModalOpen] = useState(false);
  const [gcashAmountToPay, setGcashAmountToPay] = useState(0);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNoAddressModalOpen, setIsNoAddressModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems } = location.state || { items: [] };

  const hasInStorePickup = useMemo(() => {
    return cartItems.some(
      (item) => item.Product?.purchaseMethod === "in-store-pickup"
    );
  }, [cartItems]);

  const inStorePickupItems = useMemo(() => {
    return cartItems.filter(
      (item) => item.Product?.purchaseMethod === "in-store-pickup"
    );
  }, [cartItems]);

  const regularItems = useMemo(() => {
    return cartItems.filter(
      (item) => item.Product?.purchaseMethod !== "in-store-pickup"
    );
  }, [cartItems]);

  const fetchAddressDetails = useCallback(
    async (id) => {
      try {
        const response = await getAddressById({ addressId: id, token });
        setAddressDetails(response.data);

        if (response.data.isWithinMetroManila) {
          setShippingFee(0);
          setIsFreeShipping(true);
        } else {
          const shippingResponse = await calculateShippingFee({
            addressId: id,
            token,
          });
          const fee = shippingResponse.data?.data?.shippingFee || 0;
          setShippingFee(fee);
          setIsFreeShipping(false);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch address details.");
      }
    },
    [token]
  );

  useEffect(() => {
    if (currentUser) {
      setCustomerId(currentUser.id);
      const validAddressId = Number(currentUser.defaultAddressId);
      if (!isNaN(validAddressId) && validAddressId !== 0) {
        setAddressId(validAddressId);
        fetchAddressDetails(validAddressId);
      } else {
        setAddressDetails(null);
      }
    }
  }, [currentUser, fetchAddressDetails]);

  const merchandiseSubtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + (item.Product.price || 0) * item.quantity,
      0
    );
  }, [cartItems]);

  const totalPayment = useMemo(() => {
    return merchandiseSubtotal + (isFreeShipping ? 0 : shippingFee || 0);
  }, [merchandiseSubtotal, isFreeShipping, shippingFee]);

  useEffect(() => {
    if (hasInStorePickup) {
      setPaymentMethod("G-Cash");
    } else {
      setPaymentMethod("Cash on Delivery");
    }
  }, [hasInStorePickup]);

  const calculateDownpayment = (items) => {
    return items.reduce(
      (acc, item) => acc + item.Product.price * item.quantity * 0.2,
      0
    );
  };

  const calculateAmountToPay = () => {
    let amount = 0;

    if (hasInStorePickup) {
      amount += calculateDownpayment(inStorePickupItems);
    }

    if (regularItems.length > 0) {
      const regularTotal = regularItems.reduce(
        (acc, item) => acc + item.Product.price * item.quantity,
        0
      );
      amount += regularTotal + (isFreeShipping ? 0 : shippingFee || 0);
    }

    return amount;
  };

  const requiresDownpayment = (paymentMethodParam, gcashRefNumber) => {
    return (
      hasInStorePickup && paymentMethodParam === "G-Cash" && !gcashRefNumber
    );
  };

  const requiresGCashPayment = (paymentMethodParam, gcashRefNumber) => {
    return (
      paymentMethodParam === "G-Cash" && !gcashRefNumber && !hasInStorePickup
    );
  };

  const handleDownpaymentConfirm = () => {
    setIsDownpaymentModalOpen(false);

    const amountToPay = calculateAmountToPay();
    setGcashAmountToPay(amountToPay);

    setIsGCashModalOpen(true);
    setIsWarningModalOpen(true);
  };

  const handleGCashPaymentConfirm = (referenceNumber) => {
    setIsGCashModalOpen(false);
    setIsWarningModalOpen(false);
    processCheckout(referenceNumber, "G-Cash");
  };

  const handleError = (err) => {
    console.error("Checkout error:", err);
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError("An error occurred during checkout. Please try again.");
    }
  };

  const finalizeOrder = async (gcashRefNumber, paymentMethodParam) => {
    try {
      const itemsMap = new Map();

      cartItems.forEach((item) => {
        const productId = item.Product.id;
        if (itemsMap.has(productId)) {
          itemsMap.get(productId).quantity += item.quantity;
        } else {
          itemsMap.set(productId, { productId, quantity: item.quantity });
        }
      });

      const items = Array.from(itemsMap.values());

      const payload = {
        customerId: Number(customerId),
        addressId: Number(addressId),
        items,
        token,
        merchandiseSubtotal,
        shippingFee,
        paymentMethod: paymentMethodParam,
        gcashReferenceNumber: gcashRefNumber,
      };

      const response = await createOrder(payload);
      const order = response.data;

      if (order) {
        setShippingFee(order.shippingFee || 0);
        setSuccessMessage(order.message);
        setIsDownpaymentModalOpen(false);
        setIsGCashModalOpen(false);
        setIsWarningModalOpen(false);

        navigate("/customer-profile", {
          state: { selectedMenu: "MyPurchase", activeTab: "To Pay" },
        });
      } else {
        setError("Failed to retrieve order details. Please try again.");
      }
    } catch (err) {
      handleError(err);
    }
  };

  const processCheckout = async (
    gcashRefNumber = null,
    paymentMethodParam = paymentMethod
  ) => {
    setIsProcessing(true);
    try {
      if (!addressDetails) {
        setIsNoAddressModalOpen(true);
        return;
      }

      if (requiresDownpayment(paymentMethodParam, gcashRefNumber)) {
        const downpayment = calculateDownpayment(inStorePickupItems);
        setDownpaymentAmount(downpayment);
        setIsDownpaymentModalOpen(true);
        return;
      }

      if (requiresGCashPayment(paymentMethodParam, gcashRefNumber)) {
        const amountToPay = calculateAmountToPay();
        setGcashAmountToPay(amountToPay);
        setIsGCashModalOpen(true);
        setIsWarningModalOpen(true);
        return;
      }

      await finalizeOrder(gcashRefNumber, paymentMethodParam);
    } catch (err) {
      handleError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = () => {
    processCheckout();
  };

  const openAddressModal = () => setIsAddressModalOpen(true);
  const closeAddressModal = () => setIsAddressModalOpen(false);

  const togglePaymentDropdown = () => {
    if (!hasInStorePickup) {
      setIsPaymentDropdownOpen(!isPaymentDropdownOpen);
    }
  };

  const selectPaymentMethod = (method) => {
    setPaymentMethod(method);
    setIsPaymentDropdownOpen(false);
  };

  const handleAddressChange = async () => {
    try {
      const newDefaultAddressId = currentUser.defaultAddressId;
      const response = await getAddressById({
        addressId: newDefaultAddressId,
        token,
      });

      if (response.data) {
        setAddressDetails(response.data);
        setAddressId(newDefaultAddressId);

        if (response.data.isWithinMetroManila) {
          setIsFreeShipping(true);
          setShippingFee(0);
        } else {
          setIsFreeShipping(false);
          const shippingResponse = await calculateShippingFee({
            addressId: newDefaultAddressId,
            token,
          });
          const fee = shippingResponse.data?.data?.shippingFee || 0;
          setShippingFee(fee);
        }
      } else {
        setError("Failed to fetch the updated default address.");
      }
    } catch (err) {
      setError("Failed to update address. Please try again later.");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const encodeURL = (url) =>
    encodeURIComponent(url).replace(/%2F/g, "/").replace(/%3A/g, ":");

  const closeNoAddressModal = () => {
    setIsNoAddressModalOpen(false);
  };

  const handleAddAddressClick = () => {
    setIsNoAddressModalOpen(false);
    setIsAddressModalOpen(true);
  };

  return (
    <div id="root-online-checkout">
      <div className="checkout-container">
        <header className="checkout-header">
          <div id="shop-info">
            <img
              src={logo}
              alt="G&F Auto Supply"
              id="shop-logo"
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="divider"></div>
          <h2 className="checkout-title">Checkout</h2>
        </header>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="delivery-address-section">
          <h3 className="delivery-address-title">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="delivery-icon" />{" "}
            Delivery Address
          </h3>
          {addressDetails ? (
            <p className="address-details-text">
              <strong className="space-between-phoneNo-and-addr">
                {addressDetails.fullName} {addressDetails.phoneNumber}
              </strong>
              {addressDetails.addressLine}, {addressDetails.barangay},{" "}
              {addressDetails.city}, {addressDetails.province},{" "}
              {addressDetails.region} {addressDetails.postalCode}
              <br />
              <span className="default-tag">Default</span>
              <button
                onClick={openAddressModal}
                className="change-address-link"
              >
                Change
              </button>
            </p>
          ) : (
            <p>
              No address available.{" "}
              <button
                onClick={openAddressModal}
                className="change-address-link"
              >
                Add Address
              </button>
            </p>
          )}
        </div>
        <div className="products-ordered-section">
          <div className="products-list-header">
            <span className="header-product-name">Products Ordered</span>
            <span className="header-product-price">Unit Price</span>
            <span className="header-product-quantity">Quantity</span>
            <span className="header-product-subtotal">Item Subtotal</span>
          </div>
          <ul className="products-list">
            {cartItems.map((item, index) => (
              <li key={index} className="product-item">
                <div className="product-details">
                  <div className="item-image-container">
                    <img
                      src={
                        item.Product?.images?.[0]?.imageUrl
                          ? `https://rev-auto-parts.onrender.com/${encodeURL(
                              item.Product.images[0].imageUrl.replace(
                                /\\/g,
                                "/"
                              )
                            )}`
                          : "default-image-url.jpg"
                      }
                      alt={item.Product?.name || "No image"}
                      className="item-image"
                    />
                  </div>
                  <div className="product-info">
                    <p className="product-name">{item.Product?.name}</p>
                    {item.Product?.purchaseMethod === "in-store-pickup" && (
                      <p className="pickup-only-label">In-Store Pickup Only</p>
                    )}
                  </div>
                </div>
                <p className="product-price">
                  {item.Product?.price
                    ? formatCurrency(item.Product.price)
                    : "N/A"}
                </p>
                <p className="product-quantity">{item.quantity}</p>
                <p className="product-subtotal">
                  {item.Product?.price
                    ? formatCurrency(item.Product.price * item.quantity)
                    : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="payment-method-section">
          <div className="payment-method-header">
            <span>Payment Method</span>
            <span>{paymentMethod}</span>
            {!hasInStorePickup && (
              <button
                className="change-payment-method-link"
                onClick={togglePaymentDropdown}
              >
                Change
              </button>
            )}
          </div>
          {hasInStorePickup && (
            <div className="payment-note">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="payment-note-icon"
              />
              <span className="reminder-for-instore-pickup">
                Reminder: For in-store pickup items, please complete your
                payment using GCash for downpayment.
              </span>
            </div>
          )}
          {!hasInStorePickup && isPaymentDropdownOpen && (
            <div className="payment-method-dropdown">
              <ul>
                <li onClick={() => selectPaymentMethod("Cash on Delivery")}>
                  Cash on Delivery
                </li>
                <li onClick={() => selectPaymentMethod("G-Cash")}>GCash</li>
              </ul>
            </div>
          )}
          <div className="payment-summary">
            <div className="payment-row">
              <span>Merchandise Subtotal:</span>
              <span>{formatCurrency(merchandiseSubtotal)}</span>
            </div>
            <div className="payment-row">
              <span>Shipping Total:</span>
              <span>
                {isFreeShipping
                  ? "Free Shipping Fee"
                  : formatCurrency(shippingFee || 0)}
              </span>
            </div>
            <div className="payment-row total-payment">
              <span>Total Payment:</span>
              <span>{formatCurrency(totalPayment)}</span>
            </div>
          </div>
        </div>
        <div className="checkout-actions">
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || isProcessing}
            className="checkout-button"
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </button>
        </div>
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={closeAddressModal}
          onAddressChange={handleAddressChange}
        />
        <DownpaymentModal
          isOpen={isDownpaymentModalOpen}
          onClose={() => setIsDownpaymentModalOpen(false)}
          downpaymentAmount={downpaymentAmount}
          onConfirm={handleDownpaymentConfirm}
        />
        <GCashPaymentModal
          isOpen={isGCashModalOpen}
          onClose={() => setIsGCashModalOpen(false)}
          onConfirm={handleGCashPaymentConfirm}
          amountToPay={gcashAmountToPay}
        />
        <WarningModal
          isOpen={isWarningModalOpen}
          onClose={() => setIsWarningModalOpen(false)}
        />
        {isNoAddressModalOpen && (
          <div id="root-warning-match-ref-no-modal">
            <div className="warning-modal-overlay">
              <div className="warning-modal-content">
                <h2>Please create an address</h2>
                <p className="warning-note">
                  Please create an address first before placing an order.
                </p>
                <div className="modal-actions">
                  <button
                    onClick={handleAddAddressClick}
                    className="add-address-button"
                  >
                    Add Address
                  </button>
                  <button
                    onClick={closeNoAddressModal}
                    className="close-button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineCheckout;
