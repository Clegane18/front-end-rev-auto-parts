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

const ArchivedProductsPage = () => {
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const loadArchivedProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllArchivedProducts(sortOrder);
      if (response && response.data && Array.isArray(response.data)) {
        setArchivedProducts(response.data);
      } else {
        setError("Invalid data format received from server.");
        setArchivedProducts([]);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [sortOrder]);

  useEffect(() => {
    loadArchivedProducts();
  }, [loadArchivedProducts]);

  const handleRestoreProduct = async () => {
    try {
      await restoreArchivedProductById(selectedProduct.id);
      setSuccessMessage(
        `Product ${selectedProduct.name} successfully restored.`
      );
      setShowSuccessModal(true);
      setShowConfirmRestoreModal(false);
      loadArchivedProducts();
    } catch (err) {
      setError(err.message);
      setShowConfirmRestoreModal(false);
    }
  };

  const handleRestoreClick = (product) => {
    setSelectedProduct(product);
    setShowConfirmRestoreModal(true);
    setShowProductDetailsModal(false);
  };

  const handleRestoreMultiple = async () => {
    try {
      await restoreMultipleArchivedProducts(selectedProducts);
      setSuccessMessage(`Selected products successfully restored.`);
      setShowSuccessModal(true);
      loadArchivedProducts();
      setSelectedProducts([]);
    } catch (err) {
      setError(err.message);
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
        setLoading(true);
        const result = await restoreAllArchivedProducts();
        setSuccessMessage(result.message);
        setShowSuccessModal(true);
        loadArchivedProducts();
        setLoading(false);
        setShowRestoreAllConfirmModal(false);
        setConfirmInput("");
      } catch (err) {
        setError(err.message);
        setLoading(false);
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
      await permanentlyDeleteArchivedProduct(productId);
      setSuccessMessage(`Product with ID ${productId} successfully deleted.`);
      setShowSuccessModal(true);
      loadArchivedProducts();
      setDeleteProduct(null);
    } catch (err) {
      setErrorMessage(err.message);
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

  const handleDeleteAllArchivedProducts = () => {
    if (archivedProducts.length === 0) {
      setWarningMessage("There are no archived products to delete.");
      return;
    }

    setShowDeleteAllConfirmModal(true);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div id="root-archived-products-page">
      <h1>Archives</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div className="control-panel">
            <div className="shop-info" onClick={handleBack}>
              <img src={logo} alt="G&F Auto Supply" className="shop-logo" />
            </div>
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
            <button onClick={handleRestoreAll} disabled={loading}>
              <FontAwesomeIcon icon={faRecycle} /> Restore All
            </button>
            <button
              onClick={handleRestoreMultiple}
              disabled={!selectedProducts.length || loading}
            >
              <FontAwesomeIcon icon={faUndo} /> Restore Selected Products
            </button>
            <button
              onClick={handleDeleteAllArchivedProducts}
              disabled={loading}
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {archivedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
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
                      <td>
                        <button onClick={() => handleViewDetails(product)}>
                          <FontAwesomeIcon icon={faEye} /> View
                        </button>
                        <button onClick={() => handleRestoreClick(product)}>
                          <FontAwesomeIcon icon={faTrashRestore} /> Restore
                        </button>
                        <button onClick={() => handleDeleteProduct(product)}>
                          <FontAwesomeIcon icon={faTrashAlt} /> Delete
                        </button>
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
          onConfirm={handleConfirmDelete}
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
            await deleteAllArchivedProducts();
            setSuccessMessage(
              "All archived products have been successfully deleted."
            );
            setShowSuccessModal(true);
            loadArchivedProducts();
            setShowDeleteAllConfirmModal(false);
            setConfirmInput("");
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
  );
};

export default ArchivedProductsPage;
