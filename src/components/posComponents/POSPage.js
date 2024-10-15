import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProductDetails from "./ProductDetails";
import ProductSearch from "./ProductSearch";
import CartIcon from "./CartIcon";
import ItemsByCategory from "./ItemsByCategory";
import { CartContext } from "./CartContext";
import "../../styles/posComponents/POSPage.css";
import logo from "../../assets/g&f-logo.png";
import { useLoading } from "../../contexts/LoadingContext";

const POSPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = async (product) => {
    setIsLoading(true);
    try {
      await addToCart(product);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
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
            <img src={logo} alt="G&F Auto Supply" className="shop-logo" />
          </div>
          <div className="search-results-wrapper">
            <ProductSearch onSelectProduct={handleSelectProduct} />
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
