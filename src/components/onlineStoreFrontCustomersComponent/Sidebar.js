import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/onlineStoreFrontCustomersComponent/Sidebar.css";
import { FaUser, FaAddressBook, FaLock, FaShoppingCart } from "react-icons/fa";

const Sidebar = ({ selectedMenu, setSelectedMenu }) => {
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleAccountClick = () => {
    setAccountMenuOpen(!isAccountMenuOpen);
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <button
            onClick={handleAccountClick}
            className={isAccountMenuOpen ? "active" : ""}
          >
            <FaUser className="icon" /> My Account
          </button>
          {isAccountMenuOpen && (
            <ul className="submenu">
              <li
                className={selectedMenu === "Profile" ? "active" : ""}
                onClick={() => setSelectedMenu("Profile")}
              >
                <FaUser className="icon" /> Profile
              </li>
              <li
                className={selectedMenu === "Addresses" ? "active" : ""}
                onClick={() => setSelectedMenu("Addresses")}
              >
                <FaAddressBook className="icon" /> Addresses
              </li>
              <li
                className={selectedMenu === "ChangePassword" ? "active" : ""}
                onClick={() => setSelectedMenu("ChangePassword")}
              >
                <FaLock className="icon" /> Change Password
              </li>
            </ul>
          )}
        </li>
        <li className={selectedMenu === "MyPurchase" ? "active" : ""}>
          <button
            onClick={() => setSelectedMenu("MyPurchase")}
            className={selectedMenu === "MyPurchase" ? "active" : ""}
          >
            <FaShoppingCart className="icon" /> My Purchase
          </button>
        </li>
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  selectedMenu: PropTypes.string.isRequired,
  setSelectedMenu: PropTypes.func.isRequired,
};

export default Sidebar;
