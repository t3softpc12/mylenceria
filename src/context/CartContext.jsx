import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

const addToCart = (newItem) => {
  setCart((prevCart) => {

    const existingItem = prevCart.find(
      (item) =>
        item.productid === newItem.productid &&
        item.size === newItem.size &&
        item.color === newItem.color
    );

    if (existingItem) {
      // If same product + same size + same color → increase qty
      return prevCart.map((item) =>
        item.productid === newItem.productid &&
        item.size === newItem.size &&
        item.color === newItem.color
          ? { ...item, qty: item.qty + newItem.qty }
          : item
      );
    }

    // Else add as new item
    return [...prevCart, { ...newItem, id: Date.now() }];
  });
};
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id)); // Remove item from cart
  };

  const toggleSelect = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const removeQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, toggleSelect, removeQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
