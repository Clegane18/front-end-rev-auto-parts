import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../../styles/posComponents/CartIcon.css";

const CartIcon = ({ onClick }) => {
  const { getItemCount } = useContext(CartContext);
  const itemCount = getItemCount();

  return (
    <div id="root-cart-icon">
      <div className="cart-icon-container" onClick={onClick}>
        <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
        {itemCount > 0 && <span className="item-count">{itemCount}</span>}
      </div>
    </div>
  );
};

export default CartIcon;
