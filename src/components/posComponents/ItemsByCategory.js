import React, { useState, useEffect } from "react";
import { getAllItemsByCategory } from "../../services/inventory-api";
import "../../styles/posComponents/ItemsByCategory.css";

const ItemsByCategory = ({ onSelectProduct }) => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [visibleItems, setVisibleItems] = useState({});
  const [showAll, setShowAll] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItemsByCategory();
        setGroupedProducts(data.groupedProducts);
        setVisibleItems(
          Object.keys(data.groupedProducts).reduce((acc, category) => {
            acc[category] = data.groupedProducts[category].slice(0, 3);
            return acc;
          }, {})
        );
        setShowAll(
          Object.keys(data.groupedProducts).reduce((acc, category) => {
            acc[category] = data.groupedProducts[category].length > 3;
            return acc;
          }, {})
        );
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleViewAll = (category) => {
    setVisibleItems((prev) => ({
      ...prev,
      [category]: groupedProducts[category],
    }));
    setShowAll((prev) => ({
      ...prev,
      [category]: false,
    }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div id="root-items-by-category">
      <div className="items-by-category">
        {Object.keys(groupedProducts).map((category) => (
          <div key={category} className="category-section">
            <h2 className="category-title">{category}</h2>
            <div className="products">
              {visibleItems[category].map((item) => (
                <div
                  key={item.id}
                  className="product-item"
                  onClick={() => onSelectProduct(item)}
                >
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-code">ITEM CODE: {item.itemCode}</p>
                </div>
              ))}
            </div>
            {showAll[category] && (
              <div className="view-all-container">
                <button
                  className="view-all"
                  onClick={() => handleViewAll(category)}
                >
                  View All
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsByCategory;
