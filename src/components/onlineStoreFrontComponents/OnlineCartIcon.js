import React, { useContext } from "react";
import { OnlineCartContext } from "./OnlineCartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../../styles/onlineStoreFrontComponents/OnlineCartIcon.css";

const CartIcon = ({ onClick }) => {
  const { getItemCount } = useContext(OnlineCartContext);
  const itemCount = getItemCount();

  return (
    <div id="root-online-cart-icon">
      <div className="cart-icon-container" onClick={onClick}>
        <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
        {itemCount > 0 && <span className="item-count">{itemCount}</span>}
      </div>
    </div>
  );
};

export default CartIcon;
