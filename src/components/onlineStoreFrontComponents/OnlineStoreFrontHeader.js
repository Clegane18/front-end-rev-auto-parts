import React, {  useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import OnlineProductSearch from "./OnlineProductSearch";
import OnlineCartIcon from "./OnlineCartIcon";
import logo from "../../assets/g&f-logo.png";
import { FiUser, FiLogIn, FiChevronDown } from "react-icons/fi";
import useRequireAuth from "../../utils/useRequireAuth";
import "../../styles/onlineStoreFrontComponents/OnlineStoreFrontHeader.css";

const OnlineStoreFrontHeader = ({
  handleSearch,
  handleSearchTermChange,
  handleSelectProduct,
  children,
  onScrollToCategory
}) => {
  const navigate = useNavigate();
  const checkAuth = useRequireAuth();
  const cartUpdateRef = useRef(null);

  const handleCartUpdate = () => {
    if (cartUpdateRef.current) {
      cartUpdateRef.current();
    }
  };

  const handleScrollToCategories = () => {
    if (onScrollToCategory) {
      onScrollToCategory("categories-section");
    }
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
              onClick={() => navigate("/")}
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
            <div
              id="profile-icon"
              onClick={() =>
                checkAuth("/customer-profile") && navigate("/customer-profile")
              }
            >
              {checkAuth("/customer-profile") ? (
                <FiUser size={30} />
              ) : (
                <FiLogIn size={30} />
              )}
            </div>
            <div id="cart-icon">
              <OnlineCartIcon
                onClick={() =>
                  checkAuth("/online-cart") && navigate("/online-cart")
                }
              />
            </div>
          </div>
        </header>
        <nav id="main-nav">
          <ul>
            <li>
            <NavLink to="#" onClick={handleScrollToCategories}>
                Browse Categories <FiChevronDown size={16} />
              </NavLink>
            </li>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about-us">About Us</NavLink>
            </li>
            <li>
              <NavLink to="/contact-us">Contact Us</NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {children &&
        React.cloneElement(children, { onCartUpdate: handleCartUpdate })}
    </>
  );
};

export default OnlineStoreFrontHeader;
