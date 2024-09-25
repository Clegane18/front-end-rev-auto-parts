import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnlineStoreFrontHeader from "./OnlineStoreFrontHeader";
import OnlineStoreFrontItemsByCategory from "./OnlineStoreFrontItemsByCategory";
import OnlineStoreFrontFooter from "./OnlineStoreFrontFooter";
import ProductShowcaseCarousel from "./ProductShowcaseCarousel";
import "../../styles/onlineStoreFrontComponents/OnlineStoreFrontPage.css";
import useRequireAuth from "../../utils/useRequireAuth";

const OnlineStoreFrontPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const checkAuth = useRequireAuth();
  const navigate = useNavigate();

  const scrollToCategoryRef = useRef(null);

  const handleSelectProduct = (product) => {
    if (checkAuth("/")) {
      navigate(`/product/${product.id}`, { state: { product } });
    }
  };

  const handleSearch = (searchedProducts) => {
    setProducts(searchedProducts);
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const keySequenceRef = useRef("");
  const secretCode = "gfautobigboss";
  const secretCodeLength = secretCode.length;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.length === 1) {
        keySequenceRef.current = (keySequenceRef.current + e.key).slice(
          -secretCodeLength
        );
        if (keySequenceRef.current === secretCode) {
          navigate("/login");
          keySequenceRef.current = "";
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, secretCodeLength]);

  return (
    <div id="root-online-store-front-page">
      <OnlineStoreFrontHeader
        products={products}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        handleSearchTermChange={handleSearchTermChange}
        handleSelectProduct={handleSelectProduct}
        onScrollToCategory={(categoryId) => {
          if (scrollToCategoryRef.current) {
            scrollToCategoryRef.current(categoryId);
          }
        }}
      />
      <div className="online-store-front-page">
        <ProductShowcaseCarousel />

        <div className="online-content">
          <main className="online-main">
            <div className="products-section">
              <OnlineStoreFrontItemsByCategory
                onSelectProduct={handleSelectProduct}
                exposeScrollFunction={(scrollFn) => {
                  scrollToCategoryRef.current = scrollFn;
                }}
              />
            </div>
          </main>
        </div>
        <OnlineStoreFrontFooter />
      </div>
    </div>
  );
};

export default OnlineStoreFrontPage;
