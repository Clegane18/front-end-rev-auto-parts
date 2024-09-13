import React, { useState, useEffect } from "react";
import { getPublishedItemsByCategory, getAllCategoriesInOnlineStoreFront } from "../../services/online-store-front-api";
import "../../styles/onlineStoreFrontComponents/OnlineStoreFrontItemsByCategory.css";
import { formatCurrency } from "../../utils/formatCurrency";

const encodeURL = (url) =>
  encodeURIComponent(url).replace(/%2F/g, "/").replace(/%3A/g, ":");

const OnlineStoreFrontItemsByCategory = ({ onSelectProduct }) => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [categories, setCategories] = useState([]); 
  const [visibleItems, setVisibleItems] = useState({});
  const [showAll, setShowAll] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemsAndCategories = async () => {
      try {
        const categoryData = await getAllCategoriesInOnlineStoreFront();
        setCategories(categoryData.categories);

        const productData = await getPublishedItemsByCategory();
        setGroupedProducts(productData.groupedProducts);

        setVisibleItems(
          Object.keys(productData.groupedProducts).reduce((acc, category) => {
            acc[category] = productData.groupedProducts[category].slice(0, 3);
            return acc;
          }, {})
        );
        setShowAll(
          Object.keys(productData.groupedProducts).reduce((acc, category) => {
            acc[category] = productData.groupedProducts[category].length > 3;
            return acc;
          }, {})
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items or categories:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItemsAndCategories();
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

  const scrollToCategory = (categoryId) => {
    const section = document.getElementById(categoryId);
    if (section) {
      const yOffset = -130; 
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
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
          <div key={category} className="category-section" id={category.replace(/\s+/g, '-').toLowerCase()}>
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
                    <p className="item-price">{formatCurrency(item.price)}</p>
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
        <div className="categories-section">
          <h2 className="category-header">Categories</h2>
          <div className="category-grid">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="category-item" 
                onClick={() => scrollToCategory(category.replace(/\s+/g, '-').toLowerCase())}
                style={{ cursor: 'pointer' }} 
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineStoreFrontItemsByCategory;
