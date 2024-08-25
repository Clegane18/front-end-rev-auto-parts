import React, { useState, useEffect } from "react";
import {
  fetchAllArchivedProducts,
  restoreArchivedProductById,
  restoreMultipleArchivedProducts,
  permanentlyDeleteArchivedProduct,
} from "../../services/inventory-api";
import ProductDetailsInArchivedPage from "./ProductDetailsInArchivedPage";
import SuccessModal from "../SuccessModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
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
  const [errorMessage, setErrorMessage] = useState("");

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

  return (
    <div>
      <h1>Archived Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <button
            onClick={handleRestoreMultiple}
            disabled={!selectedProducts.length}
          >
            Restore Selected Products
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
    </div>
  );
};

export default ArchivedProductsPage;
