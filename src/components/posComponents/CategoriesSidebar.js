import React, { useEffect, useState } from "react";
import "../../styles/posComponents/CategoriesSidebar.css";
import { getAllCategories } from "../../services/inventory-api";

const CategoriesSidebar = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllCategories();
        setCategories(categories);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="categories-sidebar">
      <h3>Categories</h3>
      <ul>
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category) => (
            <li key={category} onClick={() => onCategorySelect(category)}>
              {category}
            </li>
          ))
        ) : (
          <li>No categories available</li>
        )}
      </ul>
    </div>
  );
};

export default CategoriesSidebar;
