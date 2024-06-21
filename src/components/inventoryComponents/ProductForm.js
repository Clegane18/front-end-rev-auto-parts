import React, { useState } from "react";
import { addProduct } from "../../services/inventory-api"; // Ensure this is the correct path

const ProductForm = ({ onProductAdded }) => {
  const [productData, setProductData] = useState({
    category: "",
    itemCode: "",
    brand: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    supplierName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleAddProduct = async () => {
    try {
      const response = await addProduct({
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
      });
      alert("Product added successfully");
      onProductAdded(response.data);
      // Reset form fields after successful submission
      setProductData({
        category: "",
        itemCode: "",
        brand: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        supplierName: "",
      });
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="product-management">
      <h2>Product Management</h2>
      <div>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={productData.category}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="text"
          name="itemCode"
          placeholder="Item Code"
          value={productData.itemCode}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={productData.brand}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={productData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={productData.price}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={productData.stock}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="text"
          name="supplierName"
          placeholder="Supplier Name"
          value={productData.supplierName}
          onChange={handleChange}
        />
      </div>
      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  );
};

export default ProductForm;
