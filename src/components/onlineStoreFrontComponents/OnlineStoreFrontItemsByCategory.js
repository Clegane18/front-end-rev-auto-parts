import React, { useState, useEffect } from "react";
import { getPublishedItemsByCategory } from "../../services/online-store-front-api";
import "../../styles/onlineStoreFrontComponents/OnlineStoreFrontItemsByCategory.css";

const encodeURL = (url) =>
  encodeURIComponent(url).replace(/%2F/g, "/").replace(/%3A/g, ":");

const OnlineStoreFrontItemsByCategory = ({ onSelectProduct }) => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [visibleItems, setVisibleItems] = useState({});
  const [showAll, setShowAll] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getPublishedItemsByCategory();
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
        console.error("Error fetching items:", error);
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
    <div id="root-online-store-front-items-by-category">
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
                  <div className="product-image-container">
                    <img
                      src={`http://localhost:3002/${encodeURL(
                        item.imageUrl.replace(/\\/g, "/")
                      )}`}
                      alt={item.name}
                      className="product-image"
                    />
                  </div>
                  <div className="item-price-container">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">₱{item.price}</p>
                  </div>
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

export default OnlineStoreFrontItemsByCategory;
