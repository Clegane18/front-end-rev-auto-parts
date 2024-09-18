import React, { useState, useEffect, useCallback } from "react";
import { getAllProducts } from "../../services/inventory-api";
import {
  uploadProductImage,
  getProductByIdAndPublish,
  unpublishItemByProductId,
  updateProductPurchaseMethod,
} from "../../services/online-store-front-api";
import UploadPhotoModal from "./UploadPhotoModal";
import ConfirmationModal from "./ConfirmationModal";
import ChangePurchaseMethodModal from "./ChangePurchaseMethodModal";
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
  const [showChangePurchaseMethodModal, setShowChangePurchaseMethodModal] =
    useState(false);
  const [action, setAction] = useState("");
  const [newPurchaseMethod, setNewPurchaseMethod] = useState("");
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
                      <button
                        className="upload-photo-icon"
                        onClick={() => handleUploadPhotoClick(product)}
                        title="Upload Photo"
                      >
                        <FontAwesomeIcon icon={faUpload} />
                      </button>
                      {product.status === "published" ? (
                        <button
                          onClick={() => handleUnpublishClick(product.id)}
                          title="Unpublish"
                        >
                          <FontAwesomeIcon icon={faEyeSlash} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublishClick(product.id)}
                          title="Publish"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
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
    </div>
  );
};

export default UploadProducts;
