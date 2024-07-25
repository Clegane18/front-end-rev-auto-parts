import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProductDetails from "./ProductDetails";
import ProductSearch from "./ProductSearch";
import ProductList from "./ProductList";
import CartIcon from "./CartIcon";
import ItemsByCategory from "./ItemsByCategory";
import { CartContext } from "./CartContext";
import "../../styles/posComponents/POSPage.css";

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
    navigate("/dashboard");
  };

  const handleCartIconClick = () => {
    navigate("/cart");
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div id="root-pos-page">
      <div className="pos-page">
        <header className="pos-header">
          <div className="shop-info" onClick={handleBack}>
            <h1>G&F Auto Supply POS</h1>
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
        <div className="pos-content">
          <main className="pos-main">
            <div className="products-section">
              <ItemsByCategory onSelectProduct={handleSelectProduct} />
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

export default POSPage;
