// src/components/CategoryProductList.js
import React from "react";
import "../../styles/posComponents/CategoryProductList.css";

const CategoryProductList = ({ products, onSelectProduct }) => {
  return (
    <div className="category-product-list">
      {products.map((product) => (
        <div
          key={product.id}
          className="product-item"
          onClick={() => onSelectProduct(product)}
        >
          <h3>{product.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default CategoryProductList;
