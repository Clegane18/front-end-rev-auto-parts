import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/onlineStoreFrontComponents/OnlineStoreFrontFooter.css";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const OnlineStoreFrontFooter = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleMyAccountClick = () => {
    if (token) {
      navigate("/customer-profile");
    } else {
      navigate("/customer-login");
    }
  };

  const handleCartClick = () => {
    if (token) {
      navigate("/online-cart");
    } else {
      navigate("/customer-login");
    }
  };

  const handleShopClick = (e) => {
    e.preventDefault();
    const productSection = document.getElementById("product-section");
    if (productSection) {
      const yOffset = -130;
      const y =
        productSection.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleShopNowClick = (e) => {
    e.preventDefault();

    const bestSellingSection = document.getElementById(
      "best-selling-products-section"
    );
    if (bestSellingSection) {
      const yOffset = -130;
      const y =
        bestSellingSection.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div id="root-online-store-front-footer">
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h2>G&F Auto Parts</h2>
            <button className="shop-now-btn" onClick={handleShopNowClick}>
              Shop Now
            </button>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <p className="padding-bottom">
              {" "}
              1104 Gov Fortunato Halili Rd, Santa Maria, Bulacan, Philippines
            </p>
            <p className="small-letter">gf.autosupply1724@gmail.com</p>
            <p className="padding-bottom">09175590729/</p>
            <p className="padding-bottom">09329605591</p>
          </div>
          <div className="footer-section">
            <h3>Account</h3>
            <ul>
              <li
                onClick={handleMyAccountClick}
                className="account-link"
                style={{ cursor: "pointer" }}
              >
                My Account
              </li>
              <li>
                <Link to="/customer-login" className="account-link">
                  Login / Register
                </Link>
              </li>
              <li
                onClick={handleCartClick}
                className="account-link"
                style={{ cursor: "pointer" }}
              >
                Cart
              </li>
              <li>
                <button className="account-link" onClick={handleShopClick}>
                  Shop
                </button>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Quick Link</h3>
            <ul>
              <li>
                <Link to="/about-us" className="account-link">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="account-link">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="terms-and-conditions-link"
                >
                  Terms and conditions
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Follow us</h3>
            <div className="social-icons">
              <FaFacebookF />
              <FaInstagram />
            </div>
          </div>
        </div>
        <p className="copyright">© Copyright GNF 2024. All rights reserved</p>
      </footer>
    </div>
  );
};

export default OnlineStoreFrontFooter;
