import React, { useState, useEffect } from "react";
import {
  getPublishedItemsByCategory,
  getAllCategoriesInOnlineStoreFront,
  getBestSellingProductsForMonth,
  getTopSellingProducts,
} from "../../services/online-store-front-api";
import "../../styles/onlineStoreFrontComponents/OnlineStoreFrontItemsByCategory.css";
import { formatCurrency } from "../../utils/formatCurrency";

const encodeURL = (url) =>
  encodeURIComponent(url).replace(/%2F/g, "/").replace(/%3A/g, ":");

const OnlineStoreFrontItemsByCategory = ({
  onSelectProduct,
  exposeScrollFunction,
}) => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [visibleItems, setVisibleItems] = useState({});
  const [showAll, setShowAll] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [visibleBestSellers, setVisibleBestSellers] = useState([]);
  const [showAllBestSellers, setShowAllBestSellers] = useState(false);

  useEffect(() => {
    const fetchItemsAndCategories = async () => {
      try {
        let bestSellingProductsResponse = await getBestSellingProductsForMonth(
          5
        );
        let bestSellersData = bestSellingProductsResponse.data || [];

        if (bestSellersData.length === 0) {
          const topSellingProductsResponse = await getTopSellingProducts(5);
          bestSellersData = topSellingProductsResponse.data || [];
        }

        setBestSellers(bestSellersData);
        setVisibleBestSellers(bestSellersData.slice(0, 3));
        setShowAllBestSellers(bestSellersData.length > 3);

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

  const handleViewAllBestSellers = () => {
    setVisibleBestSellers(bestSellers);
    setShowAllBestSellers(false);
  };

  const scrollToCategory = (categoryId) => {
    const section = document.getElementById(categoryId);
    if (section) {
      const yOffset = -130;
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (exposeScrollFunction) {
      exposeScrollFunction(scrollToCategory);
    }
  }, [exposeScrollFunction]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div id="root-online-store-front-items-by-category">
      <div className="best-sellers-section" id="best-selling-products-section">
        <h2 className="best-selling-header">Best Selling Products</h2>
        <div className="products">
          {Array.isArray(visibleBestSellers) &&
          visibleBestSellers.length > 0 ? (
            visibleBestSellers.map((product) => (
              <div
                key={product.id}
                className="best-seller-product-item"
                onClick={() => onSelectProduct(product)}
                style={{ cursor: "pointer" }}
              >
                <div className="product-image-container">
                  <img
                    src={`http://localhost:3002/${encodeURL(
                      product.imageUrl.replace(/\\/g, "/")
                    )}`}
                    alt={product.productName}
                    className="product-image"
                  />
                </div>
                <div className="item-price-container">
                  <h3 className="item-name">{product.productName}</h3>
                  <p className="item-price">{formatCurrency(product.price)}</p>
                  <p className="item-sold">{product.totalSold} sold</p>
                </div>
              </div>
            ))
          ) : (
            <p>
              No best-selling products found at the moment. Check out our latest
              arrivals!
            </p>
          )}
        </div>
        {showAllBestSellers && (
          <div className="view-all-container">
            <button className="view-all" onClick={handleViewAllBestSellers}>
              View All
            </button>
          </div>
        )}
      </div>

      <div className="items-by-category" id="product-section">
        {Object.keys(groupedProducts).map((category) => (
          <div
            key={category}
            className="category-section"
            id={category.replace(/\s+/g, "-").toLowerCase()}
          >
            <h2 className="category-title">{category}</h2>
            <div className="products">
              {visibleItems[category].map((item) => (
                <div
                  key={item.id}
                  className={`product-item ${
                    item.purchaseMethod === "in-store-pickup"
                      ? "in-store-pickup-item"
                      : ""
                  }`}
                  onClick={() => onSelectProduct(item)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-image-container">
                    <img
                      src={`http://localhost:3002/${encodeURL(
                        item.images?.[0]?.imageUrl.replace(/\\/g, "/") ||
                          "default-image.jpg"
                      )}`}
                      alt={item.name}
                      className="product-image"
                    />
                  </div>
                  <div className="item-price-container">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">{formatCurrency(item.price)}</p>
                    {item.purchaseMethod === "in-store-pickup" && (
                      <p className="pickup-only-label">In-Store Pickup Only</p>
                    )}
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

        <div className="categories-section" id="categories-section">
          <h2 className="category-header">Categories</h2>
          <div className="category-grid">
            {categories.map((category, index) => (
              <div
                key={index}
                className="category-item"
                onClick={() =>
                  scrollToCategory(category.replace(/\s+/g, "-").toLowerCase())
                }
                style={{ cursor: "pointer" }}
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
