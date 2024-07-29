import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../posComponents/ProductDetails";
import ProductSearch from "../posComponents/ProductSearch";
import ProductList from "../posComponents/ProductList";
import CartIcon from "../posComponents/CartIcon";
import OnlineStoreFrontItemsByCategory from "./OnlineStoreFrontItemsByCategory";
import UploadProductPhotos from "./UploadProducts";
import { CartContext } from "../posComponents/CartContext";
import "../../styles/onlineStoreFrontComponents/OnlineStoreFrontPage.css";

const OnlineStoreFrontPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const { addToCart, cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setSelectedProduct(null);
  };

  const handleSearch = (products) => {
    setProducts(products);
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const handleBack = () => {
    navigate("/home");
  };

  const handleCartIconClick = () => {
    navigate("/cart");
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div id="root-online-store-front-page">
      <div className="online-store-front-page">
        <header className="store-header">
          <div className="shop-info" onClick={handleBack}>
            <h1>G&F Online Store Front</h1>
          </div>
          <div className="search-results-wrapper">
            <ProductSearch
              onSearch={handleSearch}
              onSearchTermChange={handleSearchTermChange}
            />
            {searchTerm && products.length > 0 && (
              <ProductList
                products={products}
                onSelectProduct={handleSelectProduct}
              />
            )}
          </div>
          <div className="cart-icon">
            <CartIcon
              itemCount={cartItems.length}
              onClick={handleCartIconClick}
            />
          </div>
        </header>
        <div className="store-content">
          <main className="store-main">
            <UploadProductPhotos setUploadStatus={setUploadStatus} />{" "}
            <div className="products-section">
              <OnlineStoreFrontItemsByCategory
                onSelectProduct={handleSelectProduct}
                uploadStatus={uploadStatus}
              />
            </div>
          </main>
          {selectedProduct && (
            <ProductDetails
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
