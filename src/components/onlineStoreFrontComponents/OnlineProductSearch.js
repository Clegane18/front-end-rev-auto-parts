import React, { useState } from "react";
import { searchProducts } from "../../services/pos-api";
import "../../styles/onlineStoreFrontComponents/OnlineProductSearch.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import useRequireAuth from "../../utils/useRequireAuth";

const ProductSearch = ({ onSearch, onSearchTermChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const checkAuth = useRequireAuth();

  const handleSearch = async () => {
    if (checkAuth("/customer-login")) {
      if (!searchTerm) {
        onSearch([]);
        return;
      }

      try {
        const query = { name: searchTerm, description: searchTerm };
        const products = await searchProducts(query);
        if (products.length === 0) {
          onSearch([{ id: "no-results", name: "No products found" }]);
        } else {
          onSearch(products);
        }
      } catch (error) {
        console.error("Error during product search:", error);
        onSearch([{ id: "no-results", name: "No products found" }]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearchTermChange(e.target.value);
  };

  return (
    <div id="root-product-search">
      <div className="product-search">
        <input
          type="text"
          placeholder="Search by name or description"
          value={searchTerm}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        <div className="search-icon" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
