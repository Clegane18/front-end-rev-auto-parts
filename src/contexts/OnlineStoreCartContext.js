import React, { createContext, useState, useContext, useEffect } from "react";
import { getCartItemCount, addProductToCart } from "../services/cart-api";
import { useAuth } from "../contexts/AuthContext";
const CartContext = createContext();

export const OnlineStoreFrontCartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (token) {
      fetchCartItems();
    }
  }, [token]);
  const fetchCartItems = async () => {
    try {
      if (!token) {
        console.error("Token is not available.");
        return;
      }
      const response = await getCartItemCount({ token });
      setItemCount(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error.message);
    }
  };

  const addToCart = async ({ customerId, productId, quantity }) => {
    try {
      if (!token) {
        console.error("Token is not available.");
        return;
      }
      await addProductToCart({
        customerId,
        productId,
        token,
        quantity,
      });

      setItemCount((prevCount) => prevCount + quantity);
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, itemCount, fetchCartItems, addToCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
