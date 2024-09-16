import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../../styles/onlineStoreFrontCustomersComponent/Sidebar.css";
import {
  AccountCircle,
  LocationOn,
  ShoppingCart,
  ExitToApp,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

const Sidebar = ({ selectedMenu, setSelectedMenu }) => {
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    setAccountMenuOpen(!isAccountMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setModalOpen(false);
    navigate("/customer-login");
  };

  return (
    <div id="root-side-bar">
      <div className="sidebar">
        <ul className="sidebar-menu">
          <li>
            <button
              onClick={handleAccountClick}
              className={isAccountMenuOpen ? "active" : ""}
            >
              <AccountCircle className="icon" /> My Account
            </button>
            {isAccountMenuOpen && (
              <ul className="submenu">
                <li
                  className={selectedMenu === "Profile" ? "active" : ""}
                  onClick={() => setSelectedMenu("Profile")}
                >
                  <AccountCircle className="icon" /> Profile
                </li>
                <li
                  className={selectedMenu === "Addresses" ? "active" : ""}
                  onClick={() => setSelectedMenu("Addresses")}
                >
                  <LocationOn className="icon" /> Addresses
                </li>
                <li onClick={() => setModalOpen(true)}>
                  <ExitToApp className="icon" /> Logout
                </li>
              </ul>
            )}
          </li>
          <li className={selectedMenu === "MyPurchase" ? "active" : ""}>
            <button
              onClick={() => setSelectedMenu("MyPurchase")}
              className={selectedMenu === "MyPurchase" ? "active" : ""}
            >
              <ShoppingCart className="icon" /> My Purchases
            </button>
          </li>
        </ul>
      </div>

      <LogoutConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

Sidebar.propTypes = {
  selectedMenu: PropTypes.string.isRequired,
  setSelectedMenu: PropTypes.func.isRequired,
};

export default Sidebar;
