import React, { useState, useEffect } from "react";
import {
  addProduct,
  updateProductById,
  getProductById,
} from "../../services/inventory-api";

const ProductForm = ({ selectedProductId, onProductSaved }) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    stock: "",
  });

  useEffect(() => {
    if (selectedProductId) {
      getProductById(selectedProductId).then((response) => {
        setProductData(response.data);
      });
    }
  }, [selectedProductId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProductId) {
        await updateProductById(selectedProductId, productData);
      } else {
        await addProduct(productData);
      }
      onProductSaved();
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={productData.name}
        onChange={handleChange}
        placeholder="Product Name"
        required
      />
      <input
        type="text"
        name="description"
        value={productData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        type="number"
        name="price"
        value={productData.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <input
        type="text"
        name="brand"
        value={productData.brand}
        onChange={handleChange}
        placeholder="Brand"
        required
      />
      <input
        type="number"
        name="stock"
        value={productData.stock}
        onChange={handleChange}
        placeholder="Stock"
        required
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default ProductForm;
