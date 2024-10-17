import React, { useState, useEffect } from "react";
import { searchPublishedProducts } from "../../services/pos-api";
import "../../styles/onlineStoreFrontComponents/OnlineProductSearch.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import useRequireAuth from "../../utils/useRequireAuth";

const ProductSearch = ({ onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [productSuggestions, setProductSuggestions] = useState([]);
  const checkAuth = useRequireAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedTerm) {
      handleSearch(debouncedTerm);
    } else {
      setProductSuggestions([]);
    }
  }, [debouncedTerm]);

  const handleSearch = async (term) => {
    if (checkAuth("/customer-login")) {
      if (!term) {
        setProductSuggestions([]);
        return;
      }

      if (location.pathname === "/customer-profile") {
        navigate(`/?search=${encodeURIComponent(term)}`);
        return;
      }

      try {
        const query = { name: term, description: term };
        const products = await searchPublishedProducts(query);
        if (products.length === 0) {
          setProductSuggestions([
            { id: "no-results", name: "No products found" },
          ]);
        } else {
          setProductSuggestions(products);
        }
      } catch (error) {
        console.error("Error during product search:", error);
        setProductSuggestions([
          { id: "no-results", name: "No products found" },
        ]);
      }
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.name);
    setProductSuggestions([]);
    onSelectProduct(product);
  };

  return (
    <div id="root-product-search">
      <div className="product-search">
        <input
          type="text"
          placeholder="Search by name or description"
          value={searchTerm}
          onChange={handleChange}
        />
        <div className="search-icon" onClick={() => handleSearch(searchTerm)}>
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </div>

      {productSuggestions.length > 0 && (
        <div className="suggestions">
          {productSuggestions.map((product) => (
            <div
              key={product.id}
              className={`suggestion-item ${
                product.id === "no-results" ? "no-results" : ""
              }`}
              onClick={() =>
                product.id !== "no-results" && handleSuggestionClick(product)
              }
            >
              {product.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
