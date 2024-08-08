import React, { useContext } from "react";
import { OnlineCartContext } from "./OnlineCartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/onlineStoreFrontComponents/OnlineCartIcon.css";

const CartIcon = () => {
  const { getItemCount } = useContext(OnlineCartContext);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate("/customer-login");
    } else {
      navigate("/online-cart");
    }
  };

  return (
    <div id="root-online-cart-icon">
      <div className="cart-icon-container" onClick={handleClick}>
        <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
        {itemCount > 0 && <span className="item-count">{itemCount}</span>}
      </div>
    </div>
  );
};

export default CartIcon;
