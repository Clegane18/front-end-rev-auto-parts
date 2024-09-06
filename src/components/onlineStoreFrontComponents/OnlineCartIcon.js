import React, { useContext } from "react";
import { OnlineCartContext } from "./OnlineCartContext";
import { FiShoppingCart } from "react-icons/fi";
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
        <FiShoppingCart className="cart-icon" size={30} />
        {itemCount > 0 && <span className="item-count">{itemCount}</span>}
      </div>
    </div>
  );
};

export default CartIcon;
