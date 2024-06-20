import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  addProduct,
  updateProductById,
  deleteProductById,
} from "../../services/inventory-api";
import "../../styles/inventoryComponents/ProductManagement.css";
import { FaTrash, FaEdit } from "react-icons/fa";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: 0 });

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

  const handleAddProduct = async () => {
    try {
      const response = await addProduct(newProduct);
      setProducts([...products, response.data]);
      setNewProduct({ name: "", price: 0 });
    } catch (error) {
      console.error("Failed to add product", error);
    }
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
      <h2>Product Management</h2>
      <div className="product-form">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Product Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
          }
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
      <div className="product-list">
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price.toFixed(2)}
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
