import React, { useState, useEffect } from "react";
import { getAllItemsByCategory } from "../../services/inventory-api";
import "../../styles/posComponents/ItemsByCategory.css";
import { useLoading } from "../../contexts/LoadingContext";

const ItemsByCategory = ({ onSelectProduct }) => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [visibleItems, setVisibleItems] = useState({});
  const [showAll, setShowAll] = useState({});
  const [error, setError] = useState(null);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
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
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [setIsLoading]);

  const handleViewAll = (category) => {
    setIsLoading(true);
    try {
      setVisibleItems((prev) => ({
        ...prev,
        [category]: groupedProducts[category],
      }));
      setShowAll((prev) => ({
        ...prev,
        [category]: false,
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
