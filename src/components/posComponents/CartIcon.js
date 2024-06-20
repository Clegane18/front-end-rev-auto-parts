import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../../styles/posComponents/CartIcon.css";

const CartIcon = ({ onClick, itemCount }) => {
  return (
    <div className="cart-icon-container" onClick={onClick}>
      <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
      {itemCount > 0 && <span className="item-count">{itemCount}</span>}
    </div>
  );
};

export default CartIcon;
