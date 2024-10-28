import React, { useState, useEffect, useCallback } from "react";
import {
  getAllProducts,
  getAllProductsByStatus,
} from "../../services/inventory-api";
import {
  uploadProductImages,
  getProductByIdAndPublish,
  unpublishItemByProductId,
  updateProductPurchaseMethod,
  getAllProductImagesByProductId,
  uploadShowcaseImages,
} from "../../services/online-store-front-api";
import UploadPhotoModal from "./UploadPhotoModal";
import ShowcaseUploadModal from "./ShowcaseUploadModal";
import ConfirmationModal from "./ConfirmationModal";
import ChangePurchaseMethodModal from "./ChangePurchaseMethodModal";
import ViewPicturesModal from "./ViewPicturesModal";
import ShowcaseImagesModal from "./ShowcaseImagesModal";
import SuccessModal from "../SuccessModal";
import "../../styles/onlineStoreFrontComponents/UploadProducts.css";
import "../../styles/onlineStoreFrontComponents/ShowcaseImagesModal.css";
import { formatCurrency } from "../../utils/formatCurrency";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUpload,
  faEye,
  faCheckCircle,
  faTimes,
  faImages,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/g&f-logo.png";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";

const UploadProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShowcaseUploadModal, setShowShowcaseUploadModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showChangePurchaseMethodModal, setShowChangePurchaseMethodModal] =
    useState(false);
  const [showShowcaseImagesModal, setShowShowcaseImagesModal] = useState(false);
  const [action, setAction] = useState("");
  const [newPurchaseMethod, setNewPurchaseMethod] = useState("");
  const [images, setImages] = useState([]);
  const [showViewPicturesModal, setShowViewPicturesModal] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const BASE_URL = "https://rev-auto-parts.onrender.com/";

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getAllProducts();
      if (response.data?.data) {
        setAllProducts(response.data.data);
        setFilteredProducts(response.data.data);
      } else {
        setFilteredProducts([]);
      }
    } catch (error) {
      setFilteredProducts([]);
      setErrorMessage("Failed to fetch products. Please try again later.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = useCallback(() => {
    try {
      let filtered = allProducts;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.itemCode.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.supplierName.toLowerCase().includes(query)
        );
      }

      setFilteredProducts(filtered);
    } catch (error) {
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

  const handleUploadShowcasePhotoClick = () => {
    setShowShowcaseUploadModal(true);
  };

  const handleViewPicturesClick = async (product) => {
    setIsLoading(true);
    try {
      setImagesLoading(true);
      const imagesData = await getAllProductImagesByProductId({
        productId: product.id,
      });
      setImages(imagesData || []);
      setSelectedProduct(product);
      setShowViewPicturesModal(true);
    } catch (error) {
      setErrorMessage(error.message || "Failed to fetch product images.");
    } finally {
      setImagesLoading(false);
      setIsLoading(false);
    }
  };

  const handleViewShowcaseImages = () => {
    setShowShowcaseImagesModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setSelectedProduct(null);
  };

  const handleCloseShowcaseUploadModal = () => {
    setShowShowcaseUploadModal(false);
  };

  const handleCloseShowcaseImagesModal = () => {
    setShowShowcaseImagesModal(false);
  };

  const handleSavePhoto = async (product, files) => {
    setIsLoading(true);
    try {
      await uploadProductImages(product.id, files);
      await fetchProducts();
      setShowUploadModal(false);
      setSelectedProduct(null);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
    setIsLoading(false);
  };

  const handleSaveShowcasePhotos = async (files) => {
    setIsLoading(true);
    try {
      await uploadShowcaseImages(files);
      await fetchProducts();
      setShowShowcaseUploadModal(false);
      setSuccessMessage("Showcase images uploaded successfully.");
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
    setIsLoading(false);
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
    setIsLoading(true);
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
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  const handlePurchaseMethodChange = (productId, newMethod) => {
    const product = allProducts.find((p) => p.id === productId);
    setSelectedProduct(product);
    setNewPurchaseMethod(newMethod);
    setShowChangePurchaseMethodModal(true);
  };

  const handleConfirmPurchaseMethodChange = async () => {
    setIsLoading(true);
    try {
      await updateProductPurchaseMethod({
        productId: selectedProduct.id,
        newPurchaseMethod,
      });
      await fetchProducts();
      setShowChangePurchaseMethodModal(false);
      setSelectedProduct(null);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message || "Failed to update purchase method.");
    }
    setIsLoading(false);
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

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
  };

  const handleStatusFilterChange = async (event) => {
    const status = event.target.value;
    setSelectedStatus(status);
    setIsLoading(true);
    try {
      const response = await getAllProductsByStatus({ status });
      if (response.data) {
        setFilteredProducts(response.data.products);
      } else {
        setFilteredProducts([]);
      }
    } catch (error) {
      setErrorMessage("Failed to filter products by status.");
    }
    setIsLoading(false);
  };

  return (
    <div id="root-upload-products">
      <div className="container">
        <div className="header">
          <div className="search-container">
            <div className="store-name" onClick={handleBack}>
              <img src={logo} alt="G&F Auto logo" className="shop-logo" />
            </div>
            <div className="status-filter-container">
              <label htmlFor="status-filter">Filter by Status:</label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={handleStatusFilterChange}
              >
                <option value="">All</option>
                <option value="draft">Draft</option>
                <option value="ready">Ready</option>
                <option value="published">Published</option>
              </select>
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
            <div className="upload-showcase-button-container">
              <button
                className="upload-showcase-button"
                onClick={handleUploadShowcasePhotoClick}
                title="Upload Showcase Photos"
              >
                <FontAwesomeIcon icon={faImages} /> Upload Showcase
              </button>
              <button
                className="view-showcase-button"
                onClick={handleViewShowcaseImages}
                title="View Showcase Images"
              >
                <FontAwesomeIcon icon={faEye} /> View Showcase
              </button>
            </div>
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
                <th>Purchase Method</th>
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
                      <div className="select-wrapper">
                        <select
                          value={product.purchaseMethod}
                          onChange={(e) =>
                            handlePurchaseMethodChange(
                              product.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="delivery">Delivery</option>
                          <option value="in-store-pickup">
                            In-Store Pickup
                          </option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="upload-photo-icon"
                          onClick={() => handleUploadPhotoClick(product)}
                          title="Upload Photo"
                        >
                          <FontAwesomeIcon icon={faUpload} />
                        </button>
                        <button
                          className="view-pictures-icon"
                          onClick={() => handleViewPicturesClick(product)}
                          title="View Pictures"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        {product.status === "published" ? (
                          <button
                            className="unpublish-icon"
                            onClick={() => handleUnpublishClick(product.id)}
                            title="Unpublish"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        ) : (
                          <button
                            className="publish-icon"
                            onClick={() => handlePublishClick(product.id)}
                            title="Publish"
                          >
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No products found</td>
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

      {showShowcaseUploadModal && (
        <ShowcaseUploadModal
          onSave={handleSaveShowcasePhotos}
          onClose={handleCloseShowcaseUploadModal}
        />
      )}

      {showShowcaseImagesModal && (
        <ShowcaseImagesModal onClose={handleCloseShowcaseImagesModal} />
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

      {showChangePurchaseMethodModal && (
        <ChangePurchaseMethodModal
          isOpen={showChangePurchaseMethodModal}
          onClose={() => setShowChangePurchaseMethodModal(false)}
          onConfirm={handleConfirmPurchaseMethodChange}
          newMethod={newPurchaseMethod}
          currentMethod={selectedProduct?.purchaseMethod}
          itemName={selectedProduct?.name}
        />
      )}

      {showViewPicturesModal && (
        <ViewPicturesModal
          images={images}
          loading={imagesLoading}
          baseUrl={BASE_URL}
          onClose={() => {
            setShowViewPicturesModal(false);
            setImages([]);
            setSelectedProduct(null);
          }}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          message={successMessage}
          onClose={handleCloseSuccessModal}
        />
      )}
    </div>
  );
};

export default UploadProducts;
