import React, { createContext, useState, useContext } from "react";
import { getCartItemCount, addProductToCart } from "../services/cart-api";

const CartContext = createContext();

export const CartProvider = ({ children, token }) => {
  const [cartItems, setCartItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);

  const fetchCartItems = async () => {
    try {
      if (!token) return;
      const response = await getCartItemCount({ token });
      setItemCount(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const addToCart = async ({ customerId, productId, quantity }) => {
    try {
      await addProductToCart({
        customerId,
        productId,
        token,
        quantity,
      });

      setItemCount((prevCount) => prevCount + quantity);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      throw error;
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
