import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnlineStoreFrontHeader from "./OnlineStoreFrontHeader";
import OnlineStoreFrontItemsByCategory from "./OnlineStoreFrontItemsByCategory";
import OnlineStoreFrontFooter from "./OnlineStoreFrontFooter";
import ProductShowcaseCarousel from "./ProductShowcaseCarousel";
import "../../styles/onlineStoreFrontComponents/OnlineStoreFrontPage.css";
import useRequireAuth from "../../utils/useRequireAuth";
import { useLoading } from "../../contexts/LoadingContext";

const OnlineStoreFrontPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const checkAuth = useRequireAuth();
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const scrollToCategoryRef = useRef(null);
  const keySequenceRef = useRef("");
  const secretCode = "gfautobigboss";
  const secretCodeLength = secretCode.length;

  const handleSelectProduct = (product) => {
    setIsLoading(true);
    if (checkAuth("/")) {
      navigate(`/product/${product.id}`, { state: { product } });
    }
    setIsLoading(false);
  };

  const handleSearch = (searchedProducts) => {
    setProducts(searchedProducts);
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.length === 1) {
        keySequenceRef.current = (keySequenceRef.current + e.key).slice(
          -secretCodeLength
        );
        if (keySequenceRef.current === secretCode) {
          setIsLoading(true);
          navigate("/login");
          setIsLoading(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, secretCodeLength, setIsLoading]);

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
