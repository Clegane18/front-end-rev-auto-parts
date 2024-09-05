import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import OnlineProductSearch from "./OnlineProductSearch";
import OnlineCartIcon from "./OnlineCartIcon";
import { OnlineCartContext } from "./OnlineCartContext";
import logo from "../../assets/g&f-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import useRequireAuth from "../../utils/useRequireAuth";
import "../../styles/onlineStoreFrontComponents/OnlineStoreFrontHeader.css";

const OnlineStoreFrontHeader = ({
  handleSearch,
  handleSearchTermChange,
  handleSelectProduct,
}) => {
  const { cartItems } = useContext(OnlineCartContext);
  const navigate = useNavigate();
  const checkAuth = useRequireAuth();

  const handleProfileOrLoginClick = () => {
    if (checkAuth("/customer-profile")) {
      navigate("/customer-profile");
    }
  };

  const handleCartIconClick = () => {
    if (checkAuth("/online-cart")) {
      navigate("/online-cart");
    }
  };

  const handleLogoClick = () => {
    navigate("/online-store");
  };

  return (
    <header id="online-store-header">
      <div id="shop-info">
        <img
          src={logo}
          alt="G&F Auto Supply"
          id="shop-logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div id="header-right">
        <div id="search-results-wrapper">
          <OnlineProductSearch
            onSearch={handleSearch}
            onSearchTermChange={handleSearchTermChange}
            onSelectProduct={handleSelectProduct}
          />
        </div>
        <div id="profile-icon" onClick={handleProfileOrLoginClick}>
          <FontAwesomeIcon
            icon={checkAuth("/customer-profile") ? faUser : faSignInAlt}
          />
        </div>
        <div id="cart-icon">
          <OnlineCartIcon
            itemCount={cartItems.length}
            onClick={handleCartIconClick}
          />
        </div>
      </div>
    </header>
  );
};

export default OnlineStoreFrontHeader;
