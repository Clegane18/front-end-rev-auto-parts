import React, { useState, useEffect } from "react";
import { getAllItemsByCategory } from "../../services/inventory-api";
import "../../styles/posComponents/ItemsByCategory.css";

const ItemsByCategory = ({ onSelectProduct }) => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItemsByCategory();
        setGroupedProducts(data.groupedProducts);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="items-by-category">
      {Object.keys(groupedProducts).map((category) => (
        <div key={category} className="category-section">
          <h2>{category}</h2>
          <div className="products">
            {groupedProducts[category].map((item) => (
              <div
                key={item.id}
                className="product-item"
                onClick={() => onSelectProduct(item)}
              >
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>Price: ₱{Number(item.price).toFixed(2)}</p>
                <p>Stock: {item.stock}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsByCategory;
