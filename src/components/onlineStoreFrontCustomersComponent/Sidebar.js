import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../../styles/onlineStoreFrontCustomersComponent/Sidebar.css";
import {
  AccountCircle,
  LocationOn,
  ShoppingCart,
  ExitToApp,
  Lock,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { getPasswordChangeMethod } from "../../services/online-store-front-customer-api";

const Sidebar = ({ selectedMenu, setSelectedMenu }) => {
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { logout, currentUser, token } = useAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    setAccountMenuOpen(!isAccountMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setModalOpen(false);
    navigate("/customer-login");
  };

  const handleChangePassword = async () => {
    if (!currentUser || !currentUser.id || !token) {
      console.error("User is not authenticated properly.");
      navigate("/customer-login");
      return;
    }

    try {
      const response = await getPasswordChangeMethod({
        customerId: currentUser.id,
        token,
      });
      if (response.status === 200) {
        if (response.method === "email") {
          navigate("/change-password");
        } else if (response.method === "oldPassword") {
          navigate("/request-change-password-manual");
        } else {
          navigate("/customer-login");
        }
      } else {
        console.error(response.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to get password change method:", error.message);
      navigate("/");
    }
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
                <li
                  className={selectedMenu === "ChangePassword" ? "active" : ""}
                  onClick={handleChangePassword}
                >
                  <Lock className="icon" /> Change Password
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
