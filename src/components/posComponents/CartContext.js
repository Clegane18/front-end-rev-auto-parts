import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      const updatedItems = cartItems.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + product.quantity,
              subtotalAmount:
                (item.quantity + product.quantity) * item.unitPrice,
            }
          : item
      );
      setCartItems(updatedItems.filter((item) => item.quantity > 0)); // Remove items with 0 quantity
    } else {
      setCartItems([...cartItems, product].filter((item) => item.quantity > 0)); // Remove items with 0 quantity
    }
  };

  const removeFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, quantity) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      if (quantity > 0) {
        updatedItems[index].quantity = quantity;
        updatedItems[index].subtotalAmount =
          updatedItems[index].unitPrice * quantity;
      } else {
        return updatedItems.filter((_, i) => i !== index);
      }
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
