import React, { useContext } from "react";
import { OnlineCartContext } from "./OnlineCartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../../styles/onlineStoreFrontComponents/OnlineCartIcon.css";
import useRequireAuth from "../../utils/useRequireAuth";
import { useNavigate } from "react-router-dom";

const CartIcon = () => {
  const { getItemCount } = useContext(OnlineCartContext);
  const checkAuth = useRequireAuth();
  const itemCount = getItemCount();
  const navigate = useNavigate();

  const handleClick = () => {
    if (checkAuth("/online-cart")) {
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
