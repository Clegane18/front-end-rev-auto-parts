import React, { useEffect, useState, useCallback } from "react";
import {
  getAllProducts,
  updateProductById,
  addProduct,
  getLowStockProducts,
  getProductsByDateRange,
  getProductByPriceRange,
  addToProductStock,
} from "../../services/inventory-api";
import { archiveProductById } from "../../services/archive-api";
import "../../styles/inventoryComponents/ProductManagement.css";
import EditProductModal from "./EditProductModal";
import ConfirmArchiveModal from "./ConfirmArchiveModal";
import AddProductModal from "./AddProductModal";
import AddStockModal from "./AddStockModal";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaSearch,
  FaPlusCircle,
  FaRecycle,
} from "react-icons/fa";
import { debounce } from "../../utils/debounce";
import { formatCurrency } from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";
import { faPrint, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../assets/g&f-logo.png";
import DuplicateProductModal from "./DuplicateProductModal";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [maxPriceInInventory, setMaxPriceInInventory] = useState(10000);
  const [isShowingLowStock, setIsShowingLowStock] = useState(false);
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
  const [filterType, setFilterType] = useState("default");
  const [duplicateProduct, setDuplicateProduct] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [additionalStock, setAdditionalStock] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        setAllProducts(response.data.data);
        setIsShowingLowStock(false);

        const prices = response.data.data.map((product) => product.price);
        const highestPrice = Math.max(...prices);
        setMaxPriceInInventory(highestPrice);
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
        const response = await getProductByPriceRange(minPrice, maxPrice);
        filteredProducts = response.data;
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

      if (response.status === 409) {
        setDuplicateProduct(response.data.product);
        setShowDuplicateModal(true);
      } else {
        handleProductAdded(response.data.product);
        setAddingProduct(false);
        clearErrorMessage();
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setDuplicateProduct(error.response.data.product);
        setShowDuplicateModal(true);
      } else {
        console.error("Failed to add product", error);
        setErrorMessage(
          error.response?.data?.error ||
            "Failed to add product. Please try again later."
        );
      }
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

  const handleAddQuantityToExistingProduct = async () => {
    try {
      const quantityToAdd = parseInt(additionalStock, 10);

      if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
        setErrorMessage("Please enter a valid quantity to add.");
        return;
      }

      const productId = duplicateProduct.id;

      const response = await addToProductStock(productId, quantityToAdd);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, stock: response.updatedStockCount }
            : product
        )
      );

      setShowDuplicateModal(false);
      setAddingProduct(false);
      clearErrorMessage();
    } catch (error) {
      console.error("Error adding product stock:", error.message);
      setErrorMessage(
        error.message ||
          "Failed to update product stock. Please try again later."
      );
    }
  };

  const handleArchiveProduct = async (productId) => {
    try {
      await archiveProductById(productId);
      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );
      setProducts(updatedProducts);
      setAllProducts(updatedProducts);
      setDeletingProduct(null);
      clearErrorMessage();
    } catch (error) {
      console.error("Failed to archive product:", error);
      setErrorMessage(
        error.message || "Failed to archive product. Please try again later."
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
    if (e.target.value !== "price") {
      setMinPrice("");
      setMaxPrice("");
      setProducts(allProducts);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const goToArchivedProducts = () => {
    navigate("/archived-products");
  };

  const handlePrint = () => {
    const contentElement = document.getElementById("printable-content");
    if (!contentElement) {
      console.error("Element with id 'printable-content' not found");
      return;
    }

    const printWindow = window.open("", "", "width=800,height=600");
    const content = contentElement.innerHTML;
    const issuanceDate = new Date().toLocaleDateString();

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 36px; 
              font-weight: bold;
            }
            .report-title {
              text-align: center;
              font-size: 24px; 
              font-weight: bold;
              margin-bottom: 10px;
            }
            .date {
              text-align: center;
              margin-bottom: 20px;
              font-size: 14px;
              color: #555;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f4f4f4;
            }
            .print-hide {
              display: none;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>G&F Auto Supply</h1>
          </div>
          <div class="report-title">Inventory Report</div>
          <div class="date">Issuance Date: ${issuanceDate}</div>
          <div>
            ${content}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div id="root-product-management">
      <div className="product-management-container">
        <div className="filter-bar">
          <div className="shop-info" onClick={handleBack}>
            <img src={logo} alt="G&F Auto Supply" className="shop-logo" />
          </div>
          <select
            className="filter-selector"
            value={filterType}
            onChange={handleFilterChange}
          >
            <option value="default">Default</option>
            <option value="price">Price Range</option>
            <option value="date">Date Range</option>
          </select>
          <div className="filter-inputs-container">
            {filterType === "default" && (
              <input
                className="search-bar"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%" }}
              />
            )}
            {filterType === "price" && (
              <div className="price-filter">
                <select
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ width: "100%" }}
                >
                  <option value="">Min Price</option>
                  <option value="1000">₱1,000</option>
                  <option value="2000">₱2,000</option>
                  <option value="3000">₱3,000</option>
                  <option value="4000">₱4,000</option>
                  <option value="5000">₱5,000</option>
                  <option value="6000">₱6,000</option>
                  <option value="6000">₱7,000</option>
                  <option value="8000">₱8,000</option>
                  <option value="9000">₱9,000</option>
                  <option value="10000">₱10,000</option>
                </select>

                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ width: "100%" }}
                >
                  <option value="">Max Price</option>
                  {Array.from(
                    { length: Math.ceil(maxPriceInInventory / 1000) },
                    (_, index) => (
                      <option key={index} value={(index + 1) * 1000}>
                        ₱{(index + 1) * 1000}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}
            {filterType === "date" && (
              <div className="date-filter">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: "100%" }}
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            )}
            <button onClick={handleDateRangeSearch}>
              <FaSearch />
            </button>
          </div>

          <button className="low-stock-button" onClick={handleLowStock}>
            {isShowingLowStock ? "All Products" : "Low Stock"}
          </button>
          <button
            onClick={fetchProducts}
            className="refresh-button"
            title="Refresh Inventory Products"
          >
            <FontAwesomeIcon icon={faSync} />
          </button>
          <button onClick={() => setAddingProduct(true)}>
            <FaPlusCircle /> Add Product
          </button>
          <button onClick={handlePrint} title="Print Inventory Report">
            <FontAwesomeIcon icon={faPrint} />
          </button>
          <button
            className="archive-button"
            onClick={goToArchivedProducts}
            title="View Archived Products"
          >
            <FaRecycle />
          </button>
        </div>

        <div id="printable-content">
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Item Code</th>
                  <th>Brand</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Supplier Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Added Date</th>
                  <th className="print-hide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.itemCode}</td>
                      <td>{product.brand}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.description}</td>
                      <td>{product.supplierName}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>{product.stock}</td>
                      <td>
                        {new Date(product.dateAdded).toLocaleDateString()}
                      </td>
                      <td className="print-hide">
                        <div className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => setEditingProduct(product)}
                            title="Edit Product"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => setDeletingProduct(product)}
                            title="Delete Product"
                          >
                            <FaTrash />
                          </button>
                          <button
                            className="add-stock-button"
                            onClick={() => setAddingStockProduct(product)}
                            title="Add Stock"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" style={{ textAlign: "center" }}>
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={handleUpdateProduct}
            errorMessage={errorMessage}
            clearErrorMessage={clearErrorMessage}
          />
        )}
        {deletingProduct && (
          <ConfirmArchiveModal
            product={deletingProduct}
            onClose={() => setDeletingProduct(null)}
            onConfirm={() => handleArchiveProduct(deletingProduct.id)}
            errorMessage={errorMessage}
            clearErrorMessage={clearErrorMessage}
          />
        )}
        {addingProduct && (
          <AddProductModal
            onClose={() => setAddingProduct(false)}
            onSave={handleAddProduct}
            errorMessage={errorMessage}
            clearErrorMessage={clearErrorMessage}
          />
        )}

        {addingStockProduct && (
          <AddStockModal
            product={addingStockProduct}
            onClose={() => setAddingStockProduct(null)}
            onSave={handleUpdateProduct}
          />
        )}
        {showDuplicateModal && (
          <DuplicateProductModal
            onClose={() => setShowDuplicateModal(false)}
            onConfirm={handleAddQuantityToExistingProduct}
            existingProduct={duplicateProduct}
            additionalStock={additionalStock}
            setAdditionalStock={setAdditionalStock}
            errorMessage={errorMessage}
          />
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
