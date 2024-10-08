import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import { FiShoppingCart } from "react-icons/fi";

import "../../styles/posComponents/CartIcon.css";

const CartIcon = ({ onClick }) => {
  const { getItemCount } = useContext(CartContext);
  const itemCount = getItemCount();

  return (
    <div id="root-cart-icon">
      <div className="cart-icon-container" onClick={onClick}>
        <FiShoppingCart className="cart-icon" size={30} />
        {itemCount > 0 && <span className="item-count">{itemCount}</span>}
      </div>
    </div>
  );
};

export default CartIcon;
