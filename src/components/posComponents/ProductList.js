import React from "react";
import "../../styles/ProductList.css";

const ProductList = ({ products, onSelectProduct }) => {
  return (
    <div className="product-list">
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

export default ProductList;
