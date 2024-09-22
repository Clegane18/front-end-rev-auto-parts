import React, { useState, useEffect, useCallback } from "react";
import { getAllProducts } from "../../services/inventory-api";
import {
  uploadProductImages,
  getProductByIdAndPublish,
  unpublishItemByProductId,
  updateProductPurchaseMethod,
  getAllProductImagesByProductId,
} from "../../services/online-store-front-api";
import UploadPhotoModal from "./UploadPhotoModal";
import ConfirmationModal from "./ConfirmationModal";
import ChangePurchaseMethodModal from "./ChangePurchaseMethodModal";
import ViewPicturesModal from "./ViewPicturesModal";
import "../../styles/onlineStoreFrontComponents/UploadProducts.css";
import { formatCurrency } from "../../utils/formatCurrency";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUpload,
  faEye,
  faCheckCircle,
  faTimes,
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
  const [showChangePurchaseMethodModal, setShowChangePurchaseMethodModal] =
    useState(false);
  const [action, setAction] = useState("");
  const [newPurchaseMethod, setNewPurchaseMethod] = useState("");
  const [images, setImages] = useState([]);
  const [showViewPicturesModal, setShowViewPicturesModal] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:3002/";

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

  const handleViewPicturesClick = async (product) => {
    try {
      setImagesLoading(true);
      const imagesData = await getAllProductImagesByProductId({
        productId: product.id,
      });
      console.log("API Response Images:", imagesData);
      setImages(imagesData || []);
      setSelectedProduct(product);
      setShowViewPicturesModal(true);
    } catch (error) {
      console.error("Error fetching product images:", error);
      setErrorMessage(error.message || "Failed to fetch product images.");
    } finally {
      setImagesLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setSelectedProduct(null);
  };

  const handleSavePhoto = async (product, files) => {
    try {
      await uploadProductImages(product.id, files);
      await fetchProducts();
      setShowUploadModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error uploading product photos:", error);
      setErrorMessage(
        error.response?.data?.message || "An unexpected error occurred."
      );
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

  const handlePurchaseMethodChange = (productId, newMethod) => {
    const product = allProducts.find((p) => p.id === productId);
    setSelectedProduct(product);
    setNewPurchaseMethod(newMethod);
    setShowChangePurchaseMethodModal(true);
  };

  const handleConfirmPurchaseMethodChange = async () => {
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
      console.error("Error updating purchase method:", error);
      setErrorMessage(error.message || "Failed to update purchase method.");
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
    </div>
  );
};

export default UploadProducts;
