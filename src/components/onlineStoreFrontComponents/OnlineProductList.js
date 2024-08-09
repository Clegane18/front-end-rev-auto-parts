import React from "react";
import "../../styles/onlineStoreFrontComponents/OnlineProductList.css";

const OnlineProductList = ({ products, onSelectProduct }) => {
  return (
    <div id="root-online-product-list">
      <div className="product-list">
        {products.map((product) => (
          <div
            key={product.id}
            className={`product-item ${
              product.id === "no-results" ? "no-results" : ""
            }`}
            onClick={() =>
              product.id !== "no-results" && onSelectProduct(product)
            }
          >
            <p>{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineProductList;
