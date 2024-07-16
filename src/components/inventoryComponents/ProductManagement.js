import React, { useEffect, useState, useCallback } from "react";
import {
  getAllProducts,
  updateProductById,
  deleteProductById,
  addProduct,
  getLowStockProducts,
  getProductsByDateRange,
} from "../../services/inventory-api";
import "../../styles/inventoryComponents/ProductManagement.css";
import EditProductModal from "./EditProductModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import AddProductModal from "./AddProductModal";
import AddStockModal from "./AddStockModal";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaSearch,
  FaPlusCircle,
} from "react-icons/fa";
import { debounce } from "../../utils/debounce";
import { formatCurrency } from "../../utils/formatCurrency";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [addingStockProduct, setAddingStockProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isShowingLowStock, setIsShowingLowStock] = useState(false);
  const [filterType, setFilterType] = useState("default");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        setAllProducts(response.data.data);
        setIsShowingLowStock(false);
      } else {
        console.error("API response data is not an array:", response.data);
        setProducts([]);
        setAllProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
      setAllProducts([]);
    }
  };

  const handleLowStock = async () => {
    if (isShowingLowStock) {
      setProducts(allProducts);
      setIsShowingLowStock(false);
    } else {
      try {
        const response = await getLowStockProducts();
        if (response && Array.isArray(response.data)) {
          setProducts(response.data);
          setIsShowingLowStock(true);
        } else if (response && response.message) {
          console.log(response.message);
          setProducts([]);
          setIsShowingLowStock(true);
        } else {
          console.error("Unexpected response structure:", response);
          setProducts([]);
          setIsShowingLowStock(true);
        }
      } catch (error) {
        console.error("Failed to fetch low stock products", error);
        setErrorMessage(
          "Failed to fetch low stock products. Please try again later."
        );
        setIsShowingLowStock(true);
      }
    }
  };

  const handleSearch = async () => {
    try {
      let filteredProducts = allProducts;

      if (searchQuery) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.itemCode
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.supplierName
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      }

      if (minPrice || maxPrice) {
        filteredProducts = filteredProducts.filter((product) => {
          const price = parseFloat(product.price);
          const min = minPrice ? parseFloat(minPrice) : -Infinity;
          const max = maxPrice ? parseFloat(maxPrice) : Infinity;
          return price >= min && price <= max;
        });
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Failed to search products", error);
      setErrorMessage("Failed to search products. Please try again later.");
    }
  };

  const debouncedSearch = useCallback(
    debounce(() => handleSearch(), 300),
    [searchQuery, minPrice, maxPrice, allProducts]
  );

  useEffect(() => {
    debouncedSearch();
  }, [searchQuery, minPrice, maxPrice, debouncedSearch]);

  const handleDateRangeSearch = async () => {
    try {
      const response = await getProductsByDateRange(startDate, endDate);
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        setIsShowingLowStock(false);
      } else {
        console.error("API response data is not an array:", response.data);
        setProducts([]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn(
          "No products found within the date range:",
          error.response.data.message
        );
        setProducts([]);
      } else {
        console.error("Failed to fetch products by date range", error);
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to fetch products. Please try again later."
        );
      }
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
    setAllProducts([...allProducts, newProduct]);
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
      const updatedAllProducts = allProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
      setAllProducts(updatedAllProducts);

      const minimumStockLevel = 15;

      if (isShowingLowStock) {
        const updatedLowStockProducts = updatedAllProducts.filter(
          (product) => product.stock < minimumStockLevel
        );
        setProducts(updatedLowStockProducts);
      } else {
        setProducts(updatedAllProducts);
      }

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
      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );
      setProducts(updatedProducts);
      setAllProducts(updatedProducts);
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

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    if (e.target.value !== "date") {
      setStartDate("");
      setEndDate("");
      setProducts(allProducts);
    }
  };

  return (
    <div className="product-management-container">
      <div className="search-bar">
        <select value={filterType} onChange={handleFilterChange}>
          <option value="default">Default</option>
          <option value="price">Price Range</option>
          <option value="date">Date Range</option>
        </select>

        {filterType === "default" && (
          <input
            type="text"
            placeholder="Search products by item code, brand, name, etc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}

        {filterType === "price" && (
          <>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </>
        )}

        {filterType === "date" && (
          <>
            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </>
        )}

        <button
          id="search-button"
          onClick={filterType === "date" ? handleDateRangeSearch : handleSearch}
        >
          <FaSearch />
        </button>
        <button className="low-stock-button" onClick={handleLowStock}>
          {isShowingLowStock ? "Show All" : "Low Stock"}
        </button>
      </div>

      <div className="button-container">
        <button
          className="add-product-button"
          onClick={() => {
            setAddingProduct(true);
            clearErrorMessage();
          }}
        >
          <FaPlus /> Add Product
        </button>
      </div>

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
            <div>Supplier Cost</div>
            <div>Actions</div>
          </div>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div className="product-table-row" key={product.id}>
                <div>{product.id}</div>
                <div>{product.itemCode}</div>
                <div>{product.brand}</div>
                <div>{product.name}</div>
                <div>{formatCurrency(product.price)}</div>
                <div>{product.category}</div>
                <div>{product.stock}</div>
                <div>{product.supplierName}</div>
                <div>{new Date(product.dateAdded).toLocaleDateString()}</div>
                <div>{product.description}</div>
                <div>{formatCurrency(product.supplierCost)}</div>
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
                  <button
                    onClick={() => {
                      setAddingStockProduct(product);
                      clearErrorMessage();
                    }}
                    className="add-stock"
                  >
                    <FaPlusCircle /> {/* Use the FaPlusCircle icon */}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="product-table-row">
              <div colSpan="12">No products found</div>
            </div>
          )}
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
          onConfirm={() => handleDeleteProduct(deletingProduct)}
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
      {addingStockProduct && (
        <AddStockModal
          product={addingStockProduct}
          onClose={() => {
            setAddingStockProduct(null);
            clearErrorMessage();
          }}
          onSave={(updatedProduct) => {
            handleUpdateProduct(updatedProduct);
          }}
        />
      )}
    </div>
  );
};

export default ProductManagement;
