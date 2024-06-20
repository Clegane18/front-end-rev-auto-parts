import React, { useState } from "react";
import { searchProducts } from "../../services/pos-api";
import "../../styles/posComponents/ProductSearch.css";

const ProductSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    if (!searchTerm) {
      alert("Please enter a search term.");
      return;
    }

    try {
      const query = { name: searchTerm, description: searchTerm };
      const products = await searchProducts(query);
      onSearch(products);
    } catch (error) {
      console.error("Error during product search:", error);
      alert(`Search failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="product-search">
      <input
        type="text"
        placeholder="Search by name or description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default ProductSearch;
