import React, { useState, useContext } from "react";
import OnlineStoreFrontHeader from "./OnlineStoreFrontHeader";
import OnlineProductDetails from "./OnlineProductDetails";
import OnlineStoreFrontItemsByCategory from "./OnlineStoreFrontItemsByCategory";
import { OnlineCartContext } from "./OnlineCartContext"; // Import the context
import "../../styles/onlineStoreFrontComponents/OnlineStoreFrontPage.css";
import useRequireAuth from "../../utils/useRequireAuth";

const OnlineStoreFrontPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useContext(OnlineCartContext); // Extract addToCart from context
  const checkAuth = useRequireAuth();

  const handleSelectProduct = (product) => {
    if (checkAuth("/online-store")) {
      setSelectedProduct(product);
    }
  };

  const handleAddToCart = (product) => {
    if (checkAuth("/online-store")) {
      addToCart(product); // Call addToCart from context
      setSelectedProduct(null);
    }
  };

  const handleSearch = (products) => {
    setProducts(products);
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div id="root-online-store-front-page">
      <div className="online-store-front-page">
        <OnlineStoreFrontHeader
          products={products}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          handleSearchTermChange={handleSearchTermChange}
          handleSelectProduct={handleSelectProduct}
        />
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
