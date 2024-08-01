import React, { useState, useEffect, useCallback } from "react";
import { getAllProducts } from "../../services/inventory-api";
import {
  uploadProductImage,
  getProductByIdAndPublish,
} from "../../services/online-store-front-api";
import UploadPhotoModal from "./UploadPhotoModal";
import "../../styles/onlineStoreFrontComponents/UploadProducts.css";
import { formatCurrency } from "../../utils/formatCurrency";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faUpload,
  faUndo,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const UploadProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.data?.data) {
        setAllProducts(response.data.data);
        setFilteredProducts(response.data.data);
      } else {
        console.error("Unexpected data format:", response.data);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setFilteredProducts([]);
      setErrorMessage("Failed to fetch products. Please try again later.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = useCallback(() => {
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

      setFilteredProducts(filteredProducts);
    } catch (error) {
      console.error("Failed to search products", error);
      setErrorMessage("Failed to search products. Please try again later.");
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, handleSearch]);

  const handleUploadPhotoClick = (product) => {
    setSelectedProduct(product);
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setSelectedProduct(null);
  };

  const handleSavePhoto = async (product, file) => {
    try {
      await uploadProductImage(product.id, file);
      await fetchProducts();
      setShowUploadModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error uploading product photo:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  const handlePublishClick = async (productId) => {
    try {
      await getProductByIdAndPublish(productId);
      await fetchProducts();
    } catch (error) {
      console.error("Error publishing product:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div id="root-upload-products">
      <div className="container">
        <div className="searchField">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Products"
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>{product.description}</td>
                    <td>{product.status || "N/A"}</td>
                    <td>
                      <button>
                        <FontAwesomeIcon icon={faTimes} />
                        Unpublish
                      </button>
                      <button onClick={() => handleUploadPhotoClick(product)}>
                        <FontAwesomeIcon icon={faUpload} />
                        Upload Photo
                      </button>
                      <button onClick={() => handlePublishClick(product.id)}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Publish
                      </button>
                      <button>
                        <FontAwesomeIcon icon={faUndo} />
                        Republish
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showUploadModal && selectedProduct && (
          <UploadPhotoModal
            product={selectedProduct}
            onClose={handleCloseModal}
            onSave={handleSavePhoto}
          />
        )}
      </div>
    </div>
  );
};

export default UploadProducts;
