import React from "react";
import "../../styles/ProductList.css";

const ProductList = ({ products, onSelectProduct }) => {
  return (
    <ul className="product-list">
      {products.map((product) => (
        <li
          key={product.id}
          onClick={() => onSelectProduct(product)}
          className="product-list-item"
        >
          {product.name}
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
