import React, { useState } from "react";
import "./styles/App.css";
import ProductSearch from "./components/posComponents/ProductSearch";
import ProductList from "./components/posComponents/ProductList";
import ProductDetails from "./components/posComponents/ProductDetails";
import Checkout from "./components/posComponents/Checkout";
import Receipt from "./components/posComponents/Receipt";
import { searchProducts, buyProductsOnPhysicalStore } from "./services/pos-api";

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [receipt, setReceipt] = useState(null);

  const handleSearch = async (query) => {
    try {
      const results = await searchProducts(query);
      setProducts(results.data);
    } catch (error) {
      console.error("Search failed", error);
      alert(`Search failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product) => {
    const existingItem = checkoutItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCheckoutItems(
        checkoutItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const item = { ...product, quantity: 1 };
      setCheckoutItems([...checkoutItems, item]);
    }
    setSelectedProduct(null);
  };

  const handleIncreaseQuantity = (productId) => {
    setCheckoutItems(
      checkoutItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (productId) => {
    setCheckoutItems(
      checkoutItems.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handlePay = async (items, paymentAmount) => {
    const payload = {
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      paymentAmount,
    };
    console.log("Payment Payload:", payload); // Log the payload
    try {
      const response = await buyProductsOnPhysicalStore(payload);
      setReceipt(response.receipt);
      setCheckoutItems([]);
    } catch (error) {
      console.error("Payment failed", error);
      alert(
        `Payment failed: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="app-container">
      <h1>G&F Auto Supply Store</h1>
      <ProductSearch onSearch={handleSearch} />
      {products.length > 0 && (
        <ProductList
          products={products}
          onSelectProduct={handleSelectProduct}
        />
      )}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onAddToCart={handleAddToCart}
        />
      )}
      {checkoutItems.length > 0 && (
        <Checkout
          items={checkoutItems}
          onPay={handlePay}
          onIncreaseQuantity={handleIncreaseQuantity}
          onDecreaseQuantity={handleDecreaseQuantity}
        />
      )}
      {receipt && <Receipt receipt={receipt} />}
    </div>
  );
};

export default App;
