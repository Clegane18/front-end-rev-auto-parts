import React, { useState, useEffect, useCallback } from "react";
import { getAllProducts } from "../../services/inventory-api";
import {
  uploadProductImage,
  getProductByIdAndPublish,
  unpublishItemByProductId,
} from "../../services/online-store-front-api";
import UploadPhotoModal from "./UploadPhotoModal";
import ConfirmationModal from "./ConfirmationModal";
import "../../styles/onlineStoreFrontComponents/UploadProducts.css";
import { formatCurrency } from "../../utils/formatCurrency";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUpload,
  faEyeSlash,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/g&f-logo.png";
import { useNavigate } from "react-router-dom";

const UploadProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [action, setAction] = useState("");
  const navigate = useNavigate();

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

  const handlePublishClick = (productId) => {
    setAction("publish");
    setSelectedProduct(allProducts.find((p) => p.id === productId));
    setShowConfirmationModal(true);
  };

  const handleUnpublishClick = (productId) => {
    setAction("unpublish");
    setSelectedProduct(allProducts.find((p) => p.id === productId));
    setShowConfirmationModal(true);
  };

  const handleConfirm = async () => {
    try {
      if (action === "publish") {
        await getProductByIdAndPublish(selectedProduct.id);
      } else if (action === "unpublish") {
        await unpublishItemByProductId(selectedProduct.id);
      }
      await fetchProducts();
      setShowConfirmationModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error handling action:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "draft":
        return "status-draft";
      case "ready":
        return "status-ready";
      case "published":
        return "status-published";
      default:
        return "";
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div id="root-upload-products">
      <div className="container">
        <div className="search-container">
          <div className="store-name" onClick={handleBack}>
            <img src={logo} alt="Your Logo" className="shop-logo" />
          </div>
          <div className="search-field">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="table-container">
          <table className="products-table">
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
                    <td className={getStatusClassName(product.status)}>
                      {product.status}
                    </td>
                    <td>
                      <button onClick={() => handleUploadPhotoClick(product)}>
                        <FontAwesomeIcon icon={faUpload} /> Upload Photo
                      </button>
                      {product.status === "published" ? (
                        <button
                          onClick={() => handleUnpublishClick(product.id)}
                        >
                          <FontAwesomeIcon icon={faEyeSlash} /> Unpublish
                        </button>
                      ) : (
                        <button onClick={() => handlePublishClick(product.id)}>
                          <FontAwesomeIcon icon={faCheckCircle} /> Publish
                        </button>
                      )}
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
      </div>
      {showUploadModal && (
        <UploadPhotoModal
          product={selectedProduct}
          onSave={handleSavePhoto}
          onClose={handleCloseModal}
        />
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={handleConfirm}
          action={action}
          itemName={selectedProduct?.name}
        />
      )}
    </div>
  );
};

export default UploadProducts;
