import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  updateProductById,
  deleteProductById,
} from "../../services/inventory-api";
import "../../styles/inventoryComponents/ProductManagement.css";
import ProductForm from "./ProductForm";
import EditProductModal from "./EditProductModal";
import { FaTrash, FaEdit } from "react-icons/fa";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        console.error("API response data is not an array:", response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      await updateProductById(updatedProduct.id, updatedProduct);
      setProducts(
        products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProductById(productId);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  return (
    <div className="product-management-container">
      <ProductForm onProductAdded={handleProductAdded} />
      <div className="product-list">
        <div className="product-table">
          <div className="product-table-header">
            <div>ID</div>
            <div>Item Code</div>
            <div>Brand</div>
            <div>Name</div>
            <div>Price</div>
            <div>Category</div>
            <div>Stock</div>
            <div>Supplier</div>
            <div>Date Added</div>
            <div>Description</div>
            <div>Actions</div>
          </div>
          {products.map((product) => (
            <div className="product-table-row" key={product.id}>
              <div>{product.id}</div>
              <div>{product.itemCode}</div>
              <div>{product.brand}</div>
              <div>{product.name}</div>
              <div>
                ₱
                {product.price !== undefined && !isNaN(product.price)
                  ? product.price
                  : "N/A"}
              </div>
              <div>{product.category}</div>
              <div>{product.stock}</div>
              <div>{product.supplierName}</div>
              <div>{new Date(product.dateAdded).toLocaleDateString()}</div>
              <div>{product.description}</div>
              <div>
                <button
                  onClick={() => setEditingProduct(product)}
                  className="edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleUpdateProduct}
        />
      )}
    </div>
  );
};

export default ProductManagement;
