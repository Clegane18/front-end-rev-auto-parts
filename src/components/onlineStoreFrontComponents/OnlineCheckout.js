import React, { useEffect, useState, useCallback } from "react";
import { createOrder, calculateShippingFee } from "../../services/order-api";
import { useNavigate, useLocation } from "react-router-dom";
import { getAddressById } from "../../services/address-api";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/onlineStoreFrontComponents/OnlineCheckout.css";
import logo from "../../assets/g&f-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
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

  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems } = location.state || { items: [] };

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
        setError(err.message);
      }
    },
    [token]
  );

  useEffect(() => {
    if (currentUser) {
      setCustomerId(currentUser.id);
      const validAddressId = Number(currentUser.defaultAddressId);
      if (!isNaN(validAddressId)) {
        setAddressId(validAddressId);
        fetchAddressDetails(validAddressId);
      } else {
        setError("Invalid address ID. Please update your address information.");
      }
    }
  }, [currentUser, fetchAddressDetails]);

  const handleCheckout = () => {
    processCheckout();
  };

  const processCheckout = async (
    gcashRefNumber = null,
    paymentMethodParam = paymentMethod
  ) => {
    try {
      const inStorePickupItems = cartItems.filter(
        (item) => item.Product?.purchaseMethod === "in-store-pickup"
      );
      const regularItems = cartItems.filter(
        (item) => item.Product?.purchaseMethod !== "in-store-pickup"
      );

      if (
        inStorePickupItems.length > 0 &&
        !gcashRefNumber &&
        paymentMethodParam === "G-Cash"
      ) {
        const downpayment = inStorePickupItems.reduce((acc, item) => {
          return acc + item.Product.price * item.quantity * 0.2;
        }, 0);
        setDownpaymentAmount(downpayment);
        setIsDownpaymentModalOpen(true);
        return;
      }

      if (paymentMethodParam === "G-Cash" && !gcashRefNumber) {
        let amountToPay = 0;

        if (inStorePickupItems.length > 0) {
          const downpayment = inStorePickupItems.reduce((acc, item) => {
            return acc + item.Product.price * item.quantity * 0.2;
          }, 0);
          amountToPay += downpayment;
        }

        if (regularItems.length > 0) {
          const regularItemsTotal = regularItems.reduce((acc, item) => {
            return acc + item.Product.price * item.quantity;
          }, 0);
          amountToPay +=
            regularItemsTotal + (isFreeShipping ? 0 : shippingFee || 0);
        }

        setGcashAmountToPay(amountToPay);
        setIsGCashModalOpen(true);
        setIsWarningModalOpen(true);
        return;
      }

      const merchandiseSubtotal = cartItems.reduce(
        (acc, item) => acc + (item.Product.price || 0) * item.quantity,
        0
      );

      const payload = {
        customerId: Number(customerId),
        addressId: Number(addressId),
        items: cartItems.map((item) => ({
          productId: item.Product.id,
          quantity: item.quantity,
        })),
        token,
        merchandiseSubtotal,
        shippingFee,
        paymentMethod: paymentMethodParam,
        gcashReferenceNumber: gcashRefNumber,
      };

      console.log("Sending payload:", payload);

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
      console.error("Checkout error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during checkout. Please try again.");
      }
    }
  };

  const openAddressModal = () => setIsAddressModalOpen(true);
  const closeAddressModal = () => setIsAddressModalOpen(false);

  const togglePaymentDropdown = () =>
    setIsPaymentDropdownOpen(!isPaymentDropdownOpen);

  const selectPaymentMethod = (method) => {
    setPaymentMethod(method);
    setIsPaymentDropdownOpen(false);
  };

  const handleDownpaymentConfirm = () => {
    setIsDownpaymentModalOpen(false);
    setIsGCashModalOpen(true);
    setIsWarningModalOpen(true);
  };

  const handleGCashPaymentConfirm = (referenceNumber) => {
    setIsGCashModalOpen(false);
    setIsWarningModalOpen(false);
    processCheckout(referenceNumber, "G-Cash");
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
            <p>Loading address...</p>
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
                          ? `http://localhost:3002/${encodeURL(
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
            <button
              className="change-payment-method-link"
              onClick={togglePaymentDropdown}
            >
              Change
            </button>
          </div>
          {isPaymentDropdownOpen && (
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
              <span>
                {formatCurrency(
                  cartItems.reduce(
                    (acc, item) =>
                      acc + (item.Product.price || 0) * item.quantity,
                    0
                  )
                )}
              </span>
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
              <span>
                {formatCurrency(
                  cartItems.reduce(
                    (acc, item) =>
                      acc + (item.Product.price || 0) * item.quantity,
                    0
                  ) + (isFreeShipping ? 0 : shippingFee || 0)
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="checkout-actions">
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || error}
            className="checkout-button"
          >
            Place Order
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
      </div>
    </div>
  );
};

export default OnlineCheckout;
