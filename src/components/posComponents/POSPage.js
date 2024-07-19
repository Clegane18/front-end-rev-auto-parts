import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductSearch from "./ProductSearch";
import ProductList from "./ProductList";
import CategoryProductList from "./CategoryProductList"; // New component
import ProductDetails from "./ProductDetails";
import CartIcon from "./CartIcon";
import Cart from "./Cart";
import CategoriesSidebar from "./CategoriesSidebar";
import { getProductByCategory } from "../../services/inventory-api";
import { buyProductsOnPhysicalStore } from "../../services/pos-api";
import "../../styles/posComponents/POSPage.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCategoryView, setIsCategoryView] = useState(false);
  const navigate = useNavigate();

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
                quantity: item.quantity + product.quantity,
                subtotalAmount:
                  (item.quantity + product.quantity) * item.unitPrice,
              }
            : item
        )
      );
    } else {
      setCheckoutItems([...checkoutItems, product]);
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
      newCheckoutItems[index].quantity = 1;
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
      navigate("/receipt", { state: { receipt: response.receipt } });
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

  const handleSearch = (products) => {
    setIsCategoryView(false);
    setProducts(products);
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const handleCategorySelect = async (category) => {
    try {
      const query = { category };
      const response = await getProductByCategory(query);
      setProducts(response.data.Product);
      setIsCategoryView(true);
    } catch (error) {
      console.error("Failed to fetch products by category", error);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setProducts([]);
    }
  }, [searchTerm]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="pos-page">
      <header className="pos-header">
        <div className="shop-info">
          <h1>G&F Auto Supply POS</h1>
        </div>
        <div className="search-bar">
          <ProductSearch
            onSearch={handleSearch}
            onSearchTermChange={handleSearchTermChange}
          />
        </div>
        <div className="cart-icon">
          <CartIcon
            itemCount={checkoutItems.length}
            onClick={handleCartIconClick}
          />
        </div>
      </header>
      <div className="pos-content">
        <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
          {showSidebar ? (
            <ChevronLeftIcon className="h-6 w-6" />
          ) : (
            <ChevronRightIcon className="h-6 w-6" />
          )}
        </button>
        <aside
          className={`categories-sidebar-wrapper ${
            showSidebar ? "visible" : "hidden"
          }`}
        >
          <CategoriesSidebar onCategorySelect={handleCategorySelect} />
        </aside>
        <main className="pos-main">
          <div className="products-section">
            {isCategoryView ? (
              <CategoryProductList
                products={products}
                onSelectProduct={handleSelectProduct}
              />
            ) : (
              products.length > 0 && (
                <ProductList
                  products={products}
                  onSelectProduct={handleSelectProduct}
                />
              )
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
                onPay={() => handlePay(checkoutItems, 1000)}
                onRemove={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default POSPage;
