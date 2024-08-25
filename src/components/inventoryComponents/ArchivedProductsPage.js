import React, { useState, useEffect } from "react";
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
import WarningMessage from "./WarningMessage";
import "../../styles/inventoryComponents/ArchivedProductsPage.css";

const ArchivedProductsPage = () => {
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [showDeleteAllConfirmModal, setShowDeleteAllConfirmModal] =
    useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    loadArchivedProducts();
  }, []);

  const loadArchivedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetchAllArchivedProducts();
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
  };

  const handleRestoreProduct = async (productId) => {
    try {
      await restoreArchivedProductById(productId);
      setSuccessMessage(`Product with ID ${productId} successfully restored.`);
      setShowSuccessModal(true);
      loadArchivedProducts();
    } catch (err) {
      setError(err.message);
    }
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

  const handleRestoreAll = async () => {
    try {
      setLoading(true);
      const result = await restoreAllArchivedProducts();
      setSuccessMessage(result.message);
      setShowSuccessModal(true);
      loadArchivedProducts();
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
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
  };

  const handleCloseModal = () => {
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

  return (
    <div>
      <h1>Archived Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <button onClick={handleRestoreAll} disabled={loading}>
            Restore All Archived Products
          </button>
          <button
            onClick={handleRestoreMultiple}
            disabled={!selectedProducts.length || loading}
          >
            Restore Selected Products
          </button>
          <button onClick={handleDeleteAllArchivedProducts} disabled={loading}>
            Empty Archives
          </button>
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
                    <td>{new Date(product.archivedAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleViewDetails(product)}>
                        View
                      </button>
                      <button onClick={() => handleRestoreProduct(product.id)}>
                        Restore
                      </button>
                      <button onClick={() => handleDeleteProduct(product)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
      {warningMessage && (
        <WarningMessage
          message={warningMessage}
          onClose={() => setWarningMessage("")}
        />
      )}
      {selectedProduct && (
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default ArchivedProductsPage;
