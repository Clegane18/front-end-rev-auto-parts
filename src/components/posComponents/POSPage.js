import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductSearch from "./ProductSearch";
import ProductList from "./ProductList";
import ProductDetails from "./ProductDetails";
import CartIcon from "./CartIcon";
import Cart from "./Cart";
import {
  searchProducts,
  buyProductsOnPhysicalStore,
} from "../../services/pos-api";
import "../../styles/POSPage.css";

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

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
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotalAmount: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      const item = {
        ...product,
        quantity: 1,
        unitPrice: product.price,
        subtotalAmount: product.price,
      };
      setCheckoutItems([...checkoutItems, item]);
    }
    setSelectedProduct(null);
  };

  const handleRemoveFromCart = (index) => {
    setCheckoutItems(checkoutItems.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index, quantity) => {
    const newCheckoutItems = [...checkoutItems];
    newCheckoutItems[index].quantity += quantity;
    if (newCheckoutItems[index].quantity < 1) {
      newCheckoutItems[index].quantity = 1; // Ensure quantity doesn't go below 1
    }
    newCheckoutItems[index].subtotalAmount =
      newCheckoutItems[index].quantity * newCheckoutItems[index].unitPrice;
    setCheckoutItems(newCheckoutItems);
  };

  const handlePay = async (items, paymentAmount) => {
    const payload = {
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      paymentAmount,
    };

    try {
      const response = await buyProductsOnPhysicalStore(payload);
      navigate("/receipt", { state: { receipt: response.receipt } }); // Navigate to the receipt page with receipt data
    } catch (error) {
      console.error("Payment failed", error);
      alert(
        `Payment failed: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleCartIconClick = () => {
    setShowCart(!showCart);
  };

  return (
    <div className="pos-page">
      <header className="pos-header">
        <h1>POS System</h1>
        <ProductSearch onSearch={handleSearch} />
        <CartIcon
          itemCount={checkoutItems.length}
          onClick={handleCartIconClick}
        />
      </header>
      <main className="pos-main">
        <div className="products-section">
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
        </div>
        <div className="cart-section">
          {showCart && (
            <Cart
              cartItems={checkoutItems}
              onPay={() => handlePay(checkoutItems, 1000)} // Adjust the payment amount as needed
              onRemove={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity} // Pass the handleUpdateQuantity function to the Cart component
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default POSPage;
