import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import OnlineProductSearch from "./OnlineProductSearch";
import OnlineCartIcon from "./OnlineCartIcon";
import { OnlineCartContext } from "./OnlineCartContext";
import logo from "../../assets/g&f-logo.png";
import { FiUser, FiLogIn, FiChevronDown } from "react-icons/fi";
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
    navigate("/");
  };

  return (
    <>
      <div id="root-online-store-header">
        <header id="online-store-header">
          <div id="shop-info">
            <img
              src={logo}
              alt="G&F Auto Supply"
              id="shop-logo"
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
              loading="lazy"
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
              {checkAuth("/customer-profile") ? (
                <FiUser size={30} />
              ) : (
                <FiLogIn size={30} />
              )}
            </div>
            <div id="cart-icon">
              <OnlineCartIcon
                itemCount={cartItems.length}
                onClick={handleCartIconClick}
              />
            </div>
          </div>
        </header>
        <nav id="main-nav">
          <ul>
            <li>
              <NavLink
                to="/categories"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Browse Categories <FiChevronDown size={16} />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about-us"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact-us"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Contact Us
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default OnlineStoreFrontHeader;
