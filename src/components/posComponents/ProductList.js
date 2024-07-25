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
            <p>{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
