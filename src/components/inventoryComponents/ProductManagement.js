import React, { useEffect, useState, useCallback } from "react";
import {
  getAllProducts,
  updateProductById,
  deleteProductById,
  addProduct,
  getProductByItemCode,
  getProductByBrand,
  getProductByPriceRange,
  getProductByNameOrDescription,
  getProductsByDateRange,
  getLowStockProducts,
} from "../../services/inventory-api";
import "../../styles/inventoryComponents/ProductManagement.css";
import EditProductModal from "./EditProductModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import AddProductModal from "./AddProductModal";
import { FaTrash, FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import { debounce } from "../../utils/debounce";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("itemCode");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        console.error("API response data is not an array:", response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      fetchProducts();
      return;
    }

    let response;
    try {
      switch (searchFilter) {
        case "itemCode":
          response = await getProductByItemCode(searchQuery);
          break;
        case "brand":
          response = await getProductByBrand(searchQuery);
          break;
        case "priceRange":
          const [minPrice, maxPrice] = searchQuery.split("-");
          response = await getProductByPriceRange(minPrice, maxPrice);
          break;
        case "nameOrDescription":
          response = await getProductByNameOrDescription(searchQuery);
          break;
        case "dateRange":
          const [startDate, endDate] = searchQuery.split(",");
          response = await getProductsByDateRange(startDate, endDate);
          break;
        case "lowStock":
          response = await getLowStockProducts();
          break;
        default:
          return;
      }
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to search products", error);
    }
  };

  const debouncedSearch = useCallback(
    debounce(() => handleSearch(), 300),
    [searchQuery, searchFilter]
  );

  useEffect(() => {
    if (searchQuery === "") {
      fetchProducts();
    } else {
      debouncedSearch();
    }
  }, [searchQuery, debouncedSearch]);

  const handleProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleAddProduct = async (productData) => {
    try {
      const response = await addProduct(productData);
      handleProductAdded(response.data.product);
      setAddingProduct(false);
      clearErrorMessage();
    } catch (error) {
      console.error("Failed to add product", error);
      setErrorMessage(
        error.response?.data?.error ||
          "Failed to add product. Please try again later."
      );
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      await updateProductById(updatedProduct.id, updatedProduct);
      setProducts(
        products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      setEditingProduct(null);
      clearErrorMessage();
    } catch (error) {
      console.error("Failed to update product", error);
      setErrorMessage(
        error.response?.data?.error ||
          "Failed to update product. Please try again later."
      );
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProductById(productId);
      setProducts(products.filter((product) => product.id !== productId));
      setDeletingProduct(null);
      clearErrorMessage();
    } catch (error) {
      console.error("Failed to delete product:", error);
      setErrorMessage(
        error.message || "Failed to delete product. Please try again later."
      );
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  return (
    <div className="product-management-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button id="search-button" onClick={handleSearch}>
          <FaSearch />
        </button>
        <select
          id="search-filter"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        >
          <option value="itemCode">Item Code</option>
          <option value="brand">Brand</option>
          <option value="priceRange">Price Range</option>
          <option value="nameOrDescription">Name or Description</option>
          <option value="dateRange">Date Range</option>
          <option value="lowStock">Low Stock</option>
        </select>
      </div>
      <button
        className="add-product-button"
        onClick={() => {
          setAddingProduct(true);
          clearErrorMessage();
        }}
      >
        <FaPlus /> Add Product
      </button>
      <div className="product-list">
        <div className="product-table">
          <div className="product-table-header">
            <div>ID</div>
            <div>Item Code</div>
            <div>Brand</div>
            <div>Name</div>
            <div>Price</div>
            <div>Category</div>
            <div>Stock</div>
            <div>Supplier</div>
            <div>Date Added</div>
            <div>Description</div>
            <div>Actions</div>
          </div>
          {products.map((product) => (
            <div className="product-table-row" key={product.id}>
              <div>{product.id}</div>
              <div>{product.itemCode}</div>
              <div>{product.brand}</div>
              <div>{product.name}</div>
              <div>
                ₱
                {product.price !== undefined && !isNaN(product.price)
                  ? product.price
                  : "N/A"}
              </div>
              <div>{product.category}</div>
              <div>{product.stock}</div>
              <div>{product.supplierName}</div>
              <div>{new Date(product.dateAdded).toLocaleDateString()}</div>
              <div>{product.description}</div>
              <div>
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    clearErrorMessage();
                  }}
                  className="edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    setDeletingProduct(product.id);
                    clearErrorMessage();
                  }}
                  className="delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            clearErrorMessage();
          }}
          onSave={handleUpdateProduct}
          errorMessage={errorMessage}
          clearErrorMessage={clearErrorMessage}
        />
      )}
      {deletingProduct && (
        <ConfirmDeleteModal
          product={products.find((p) => p.id === deletingProduct)}
          onClose={() => {
            setDeletingProduct(null);
            clearErrorMessage();
          }}
          onConfirm={handleDeleteProduct}
          errorMessage={errorMessage}
          clearErrorMessage={clearErrorMessage}
        />
      )}
      {addingProduct && (
        <AddProductModal
          onClose={() => {
            setAddingProduct(false);
            clearErrorMessage();
          }}
          onSave={handleAddProduct}
          errorMessage={errorMessage}
          clearErrorMessage={clearErrorMessage}
        />
      )}
    </div>
  );
};

export default ProductManagement;
