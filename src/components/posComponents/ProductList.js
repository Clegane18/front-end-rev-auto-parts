import React from "react";
import "../../styles/posComponents/ProductList.css";

const ProductList = ({ products, onSelectProduct }) => {
  return (
    <div id="root-product-list">
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
    </div>
  );
};

export default ProductList;
