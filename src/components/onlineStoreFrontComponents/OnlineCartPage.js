import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cart from "./OnlineCart";
import { buyProductsOnPhysicalStore } from "../../services/pos-api";

const OnlineCartPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkoutItems } = location.state || { checkoutItems: [] };

  const handlePay = async (items, paymentAmount) => {
    const payload = {
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      paymentAmount,
    };

    try {
      const response = await buyProductsOnPhysicalStore(payload);
      navigate("/receipt", { state: { receipt: response.receipt } });
    } catch (error) {
      console.error("Payment failed", error);
      alert(
        `Payment failed: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleRemoveFromCart = (index) => {
    const newCheckoutItems = checkoutItems.filter((_, i) => i !== index);
    navigate("/online-cart", { state: { checkoutItems: newCheckoutItems } });
  };

  const handleUpdateQuantity = (index, quantity) => {
    const newCheckoutItems = [...checkoutItems];
    newCheckoutItems[index].quantity += quantity;
    if (newCheckoutItems[index].quantity < 1) {
      newCheckoutItems[index].quantity = 1;
    }
    newCheckoutItems[index].subtotalAmount =
      newCheckoutItems[index].quantity * newCheckoutItems[index].unitPrice;
    navigate("/online-cart", { state: { checkoutItems: newCheckoutItems } });
  };

  return (
    <div className="online-cart-page">
      <Cart
        cartItems={checkoutItems}
        onPay={() => handlePay(checkoutItems, 1000)}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
};

export default OnlineCartPage;
