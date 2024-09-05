import React, { useState, useEffect } from "react";
import { searchProducts } from "../../services/pos-api";
import "../../styles/posComponents/ProductSearch.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const ProductSearch = ({ onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedTerm) {
      handleSearch(debouncedTerm);
    } else {
      setProductSuggestions([]);
    }
  }, [debouncedTerm]);

  const handleSearch = async (term) => {
    setIsSearching(true);
    try {
      const query = { name: term, description: term };
      const products = await searchProducts(query);
      setProductSuggestions(products);
    } catch (error) {
      console.error("Error during product search:", error);
      alert(`Search failed: ${error.response?.data?.message || error.message}`);
    }
    setIsSearching(false);
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
        <div className="search-icon">
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </div>

      {productSuggestions.length > 0 && (
        <div className="suggestions">
          {productSuggestions.map((product) => (
            <div
              key={product.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(product)}
            >
              {product.name}
            </div>
          ))}
        </div>
      )}

      {isSearching && <div className="loading">Searching...</div>}
    </div>
  );
};

export default ProductSearch;
