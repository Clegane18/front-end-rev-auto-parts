import React, { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import "../../styles/onlineStoreFrontComponents/OnlineCartIcon.css";
import { getCartItemCount } from "../../services/cart-api";
import { useAuth } from "../../contexts/AuthContext";

const OnlineCartIcon = ({ onCartUpdateRef, onClick }) => {
  const [itemCount, setItemCount] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    const fetchItemCount = async () => {
      try {
        const response = await getCartItemCount({ token });
        setItemCount(response.data);
      } catch (error) {
        console.error("Error fetching item count:", error.message);
      }
    };

    if (token) {
      fetchItemCount();
    }

    if (onCartUpdateRef) {
      onCartUpdateRef.current = fetchItemCount;
    }
  }, [token, onCartUpdateRef]);

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
