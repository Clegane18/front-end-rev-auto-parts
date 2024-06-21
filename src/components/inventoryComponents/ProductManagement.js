import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  updateProductById,
  deleteProductById,
} from "../../services/inventory-api";
import "../../styles/inventoryComponents/ProductManagement.css";
import ProductForm from "./ProductForm";
import { FaTrash, FaEdit } from "react-icons/fa";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      if (Array.isArray(response.data)) {
        setProducts(response.data);
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

  const handleUpdateProduct = async (productId, updatedProduct) => {
    try {
      await updateProductById(productId, updatedProduct);
      setProducts(
        products.map((product) =>
          product.id === productId ? updatedProduct : product
        )
      );
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
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ₱
              {product.price !== undefined && !isNaN(product.price)
                ? product.price.toFixed(2)
                : "N/A"}
              <button
                onClick={() =>
                  handleUpdateProduct(product.id, {
                    ...product,
                    price: product.price + 1,
                  })
                }
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="delete"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductManagement;
