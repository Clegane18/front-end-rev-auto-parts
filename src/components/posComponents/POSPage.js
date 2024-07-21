import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductSearch from "./ProductSearch";
import ProductList from "./ProductList";
import ProductDetails from "./ProductDetails";
import CartIcon from "./CartIcon";
import ItemsByCategory from "./ItemsByCategory";
import "../../styles/posComponents/POSPage.css";

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product) => {
    const existingItem = checkoutItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCheckoutItems(
        checkoutItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + product.quantity,
                subtotalAmount:
                  (item.quantity + product.quantity) * item.unitPrice,
              }
            : item
        )
      );
    } else {
      setCheckoutItems([...checkoutItems, product]);
    }
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
    navigate("/cart", { state: { checkoutItems } });
  };

  return (
    <div className="pos-page">
      <header className="pos-header">
        <div className="shop-info" onClick={handleBack}>
          <h1>G&F Auto Supply POS</h1>
        </div>
        <div className="search-bar">
          <ProductSearch
            onSearch={handleSearch}
            onSearchTermChange={handleSearchTermChange}
          />
        </div>
        <div className="cart-icon">
          <CartIcon
            itemCount={checkoutItems.length}
            onClick={handleCartIconClick}
          />
        </div>
      </header>
      <div className="pos-content">
        <main className="pos-main">
          <div className="products-section">
            <ItemsByCategory onSelectProduct={handleSelectProduct} />
            {searchTerm && products.length > 0 && (
              <ProductList
                products={products}
                onSelectProduct={handleSelectProduct}
              />
            )}
            {selectedProduct && (
              <ProductDetails
                product={selectedProduct}
                onAddToCart={handleAddToCart}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default POSPage;
