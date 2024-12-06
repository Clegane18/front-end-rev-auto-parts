import React, { useState, useEffect, useCallback } from "react";
import {
  fetchAllArchivedProducts,
  restoreArchivedProductById,
  restoreMultipleArchivedProducts,
  restoreAllArchivedProducts,
  deleteAllArchivedProducts,
  permanentlyDeleteArchivedProduct,
} from "../../services/archive-api";
import ProductDetailsInArchivedPage from "./ProductDetailsInArchivedPage";
import SuccessModal from "../SuccessModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ConfirmDeleteAllModal from "./ConfirmDeleteAllModal";
import ConfirmRestoreAllModal from "./ConfirmRestoreAllModal";
import WarningMessage from "./WarningMessage";
import "../../styles/inventoryComponents/ArchivedProductsPage.css";
import {
  faRecycle,
  faTrashAlt,
  faEye,
  faUndo,
  faTrashRestore,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../assets/g&f-logo.png";
import { useNavigate } from "react-router-dom";
import ConfirmRestoreModal from "./ConfirmRestoreModal";
import { useLoading } from "../../contexts/LoadingContext";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

const ArchivedProductsPage = () => {
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [showDeleteAllConfirmModal, setShowDeleteAllConfirmModal] =
    useState(false);
  const [showRestoreAllConfirmModal, setShowRestoreAllConfirmModal] =
    useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [showConfirmRestoreModal, setShowConfirmRestoreModal] = useState(false);

  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const { authToken } = useAdminAuth();

  const loadArchivedProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllArchivedProducts(sortOrder, authToken);
      if (response && response.status === 200) {
        const products = response.data.map((product) => {
          const now = new Date();
          const deleteDate = new Date(product.archivedAt);
          deleteDate.setFullYear(deleteDate.getFullYear() + 1);
          const timeDiff = deleteDate - now;
          const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
          return {
            ...product,
            daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
          };
        });
        setArchivedProducts(products);
      } else {
        setError("Invalid response from the server.");
        setArchivedProducts([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [sortOrder, setIsLoading, authToken]);

  useEffect(() => {
    loadArchivedProducts();
  }, [loadArchivedProducts]);

  const handleRestoreProduct = async () => {
    try {
      setIsLoading(true);
      await restoreArchivedProductById(selectedProduct.id, authToken);
      setSuccessMessage(
        `Product ${selectedProduct.name} successfully restored.`
      );
      setShowSuccessModal(true);
      setShowConfirmRestoreModal(false);
      loadArchivedProducts();
    } catch (err) {
      setError(err.message);
      setShowConfirmRestoreModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreClick = (product) => {
    setSelectedProduct(product);
    setShowConfirmRestoreModal(true);
    setShowProductDetailsModal(false);
  };

  const handleRestoreMultiple = async () => {
    try {
      setIsLoading(true);
      await restoreMultipleArchivedProducts(selectedProducts, authToken);
      setSuccessMessage("Selected products successfully restored.");
      setShowSuccessModal(true);
      loadArchivedProducts();
      setSelectedProducts([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreAll = () => {
    if (archivedProducts.length === 0) {
      setWarningMessage("There are no archived products to restore.");
      return;
    }
    setShowRestoreAllConfirmModal(true);
  };

  const confirmRestoreAll = async () => {
    if (confirmInput === "CONFIRM RESTORE ALL") {
      try {
        setIsLoading(true);
        const result = await restoreAllArchivedProducts(authToken);
        setSuccessMessage(result.message);
        setShowSuccessModal(true);
        loadArchivedProducts();
        setShowRestoreAllConfirmModal(false);
        setConfirmInput("");
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Please type 'CONFIRM RESTORE ALL' to confirm.");
    }
  };

  const handleDeleteProduct = (product) => {
    setDeleteProduct(product);
  };

  const handleConfirmDelete = async (productId) => {
    try {
      setIsLoading(true);
      await permanentlyDeleteArchivedProduct(productId, authToken);
      setSuccessMessage(`Product with ID ${productId} successfully deleted.`);
      setShowSuccessModal(true);
      loadArchivedProducts();
      setDeleteProduct(null);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowProductDetailsModal(true);
    setShowConfirmRestoreModal(false);
  };

  const handleCloseModal = () => {
    setShowProductDetailsModal(false);
    setSelectedProduct(null);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  const handleDeleteAllArchivedProducts = async () => {
    if (archivedProducts.length === 0) {
      setWarningMessage("There are no archived products to delete.");
      return;
    }
    setShowDeleteAllConfirmModal(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div id="archived-products-root">
      <div className="archived-products-container">
        <div className="control-panel">
          <div className="shop-info" onClick={handleBack}>
            <img src={logo} alt="G&F Auto Supply" className="shop-logo" />
          </div>
          <h1>Archives</h1>
        </div>
        {error ? (
          <p className="error-message">Error: {error}</p>
        ) : (
          <>
            <div className="archived-products-actions">
              <div className="sort-order-container">
                <label htmlFor="sortOrder">Sort By: </label>
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
                </select>
              </div>
              <button
                className="primary-button"
                onClick={handleRestoreAll}
                disabled={false}
              >
                <FontAwesomeIcon icon={faRecycle} /> Restore All
              </button>
              <button
                className="secondary-button"
                onClick={handleRestoreMultiple}
                disabled={!selectedProducts.length}
              >
                <FontAwesomeIcon icon={faUndo} /> Restore Selected
              </button>
              <button
                className="danger-button"
                onClick={async () => {
                  try {
                    if (archivedProducts.length === 0) {
                      setWarningMessage(
                        "There are no archived products to delete."
                      );
                      return;
                    }
                    setShowDeleteAllConfirmModal(true);
                  } catch (err) {
                    setErrorMessage(err.message);
                  }
                }}
                disabled={false}
              >
                <FontAwesomeIcon icon={faTrashAlt} /> Empty Archives
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date Archived</th>
                    <th>Days Remaining</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No archived products available.
                      </td>
                    </tr>
                  ) : (
                    archivedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                          />
                        </td>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>
                          {new Date(product.archivedAt).toLocaleDateString()}
                        </td>
                        <td>{product.daysRemaining}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="primary-button small"
                              onClick={() => handleViewDetails(product)}
                            >
                              <FontAwesomeIcon icon={faEye} /> View
                            </button>
                            <button
                              className="success-button small"
                              onClick={() => handleRestoreClick(product)}
                            >
                              <FontAwesomeIcon icon={faTrashRestore} /> Restore
                            </button>
                            <button
                              className="danger-button small"
                              onClick={() => handleDeleteProduct(product)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {warningMessage && (
          <WarningMessage
            message={warningMessage}
            onClose={() => setWarningMessage("")}
          />
        )}
        {showProductDetailsModal && selectedProduct && (
          <ProductDetailsInArchivedPage
            product={selectedProduct}
            onClose={handleCloseModal}
          />
        )}
        {deleteProduct && (
          <ConfirmDeleteModal
            product={deleteProduct}
            onClose={() => setDeleteProduct(null)}
            onConfirm={async (productId) => {
              try {
                setIsLoading(true);
                await permanentlyDeleteArchivedProduct(productId, authToken);
                setSuccessMessage(
                  `Product with ID ${productId} successfully deleted.`
                );
                setShowSuccessModal(true);
                loadArchivedProducts();
                setDeleteProduct(null);
              } catch (err) {
                setErrorMessage(err.message);
              } finally {
                setIsLoading(false);
              }
            }}
            errorMessage={errorMessage}
            clearErrorMessage={clearErrorMessage}
          />
        )}
        {showSuccessModal && (
          <SuccessModal
            message={successMessage}
            onClose={handleCloseSuccessModal}
          />
        )}
        {showDeleteAllConfirmModal && (
          <ConfirmDeleteAllModal
            onClose={() => setShowDeleteAllConfirmModal(false)}
            onConfirm={async () => {
              try {
                setIsLoading(true);
                await deleteAllArchivedProducts(authToken);
                setSuccessMessage(
                  "All archived products have been successfully deleted."
                );
                setShowSuccessModal(true);
                loadArchivedProducts();
                setShowDeleteAllConfirmModal(false);
                setConfirmInput("");
              } catch (err) {
                setErrorMessage(err.message);
              } finally {
                setIsLoading(false);
              }
            }}
            confirmInput={confirmInput}
            setConfirmInput={setConfirmInput}
            errorMessage={errorMessage}
          />
        )}
        {showConfirmRestoreModal && selectedProduct && (
          <ConfirmRestoreModal
            product={selectedProduct}
            onClose={() => setShowConfirmRestoreModal(false)}
            onConfirm={handleRestoreProduct}
            errorMessage={errorMessage}
            clearErrorMessage={clearErrorMessage}
          />
        )}
        {showRestoreAllConfirmModal && (
          <ConfirmRestoreAllModal
            onClose={() => setShowRestoreAllConfirmModal(false)}
            onConfirm={confirmRestoreAll}
            confirmInput={confirmInput}
            setConfirmInput={setConfirmInput}
            errorMessage={errorMessage}
          />
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ArchivedProductsPage;
