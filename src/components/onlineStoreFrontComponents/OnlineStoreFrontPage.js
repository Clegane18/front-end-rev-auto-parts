import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import OnlineProductDetails from "./OnlineProductDetails";
import OnlineProductSearch from "./OnlineProductSearch";
import OnlineProductList from "./OnlineProductList";
import OnlineCartIcon from "./OnlineCartIcon";
import OnlineStoreFrontItemsByCategory from "./OnlineStoreFrontItemsByCategory";
import { OnlineCartContext } from "./OnlineCartContext";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/onlineStoreFrontComponents/OnlineStoreFrontPage.css";
import logo from "../../assets/g&f-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

const OnlineStoreFrontPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart, cartItems } = useContext(OnlineCartContext);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSelectProduct = (product) => {
    if (!isAuthenticated) {
      navigate("/customer-login");
      return;
    }
    setSelectedProduct(product);
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate("/customer-login");
      return;
    }
    addToCart(product);
    setSelectedProduct(null);
  };

  const handleSearch = (products) => {
    setProducts(products);
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const handleCartIconClick = () => {
    navigate("/online-cart");
  };

  const handleProfileOrLoginClick = () => {
    if (isAuthenticated) {
      navigate("/customer-profile");
    } else {
      navigate("/customer-login");
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div id="root-online-store-front-page">
      <div className="online-store-front-page">
        <header className="online-header">
          <div className="shop-info">
            <img src={logo} alt="G&F Auto Supply" className="shop-logo" />
          </div>
          <div className="header-right">
            <div className="search-results-wrapper">
              <OnlineProductSearch
                onSearch={handleSearch}
                onSearchTermChange={handleSearchTermChange}
              />
              {searchTerm && products.length > 0 && (
                <OnlineProductList
                  products={products}
                  onSelectProduct={handleSelectProduct}
                />
              )}
            </div>
            <div className="profile-icon" onClick={handleProfileOrLoginClick}>
              <FontAwesomeIcon icon={isAuthenticated ? faUser : faSignInAlt} />
            </div>
            <div className="cart-icon">
              <OnlineCartIcon
                itemCount={cartItems.length}
                onClick={handleCartIconClick}
              />
            </div>
          </div>
        </header>
        <div className="online-content">
          <main className="online-main">
            <div className="products-section">
              <OnlineStoreFrontItemsByCategory
                onSelectProduct={handleSelectProduct}
              />
            </div>
          </main>
          {selectedProduct && (
            <OnlineProductDetails
              product={selectedProduct}
              onAddToCart={handleAddToCart}
              onClose={handleCloseModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlineStoreFrontPage;
