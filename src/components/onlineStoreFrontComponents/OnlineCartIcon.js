import React, { useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import "../../styles/onlineStoreFrontComponents/OnlineCartIcon.css";
import { useCart } from "../../contexts/OnlineStoreCartContext";
import { useAuth } from "../../contexts/AuthContext";

const OnlineCartIcon = ({ onCartUpdateRef, onClick }) => {
  const { itemCount, fetchCartItems } = useCart();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchCartItems();
    }

    if (onCartUpdateRef) {
      onCartUpdateRef.current = fetchCartItems;
    }
  }, [token, fetchCartItems, onCartUpdateRef]);

  return (
    <div id="root-online-cart-icon" onClick={onClick}>
      <div className="cart-icon-container">
        <FiShoppingCart className="cart-icon" size={30} />
        {itemCount > 0 && <span className="item-count">{itemCount}</span>}
      </div>
    </div>
  );
};

export default OnlineCartIcon;
