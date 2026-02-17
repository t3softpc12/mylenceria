// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);



//   useEffect(() => {
//   const fetchCart = async () => {
//     // 🟢 Guest user
//     if (!user?.accountid) {
//       const saved = localStorage.getItem("guest_cart");
//       if (saved) {
//         try {
//           const parsed = JSON.parse(saved);
//           setCart(Array.isArray(parsed) ? parsed : []);
//         } catch (e) {
//           console.error("Failed to parse guest cart", e);
//           localStorage.removeItem("guest_cart");
//           setCart([]);
//         }
//       } else {
//         setCart([]);
//       }
//       return;
//     }

//     // 🔵 Logged-in user → fetch from backend
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_GET_CART}?user_id=${user.accountid}`
//       );

//       if (response.data.success) {
//         setCart(response.data.cart || []);
//       } else {
//         setCart([]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch cart from backend", err);
//       setCart([]);
//     }
//   };

//   fetchCart();
// }, [user?.accountid]);


  // ================= SAVE CART =================



const syncGuestCartToDB = async (userId) => {
  const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
  if (!guestCart.length) return;

  try {
    await Promise.all(
      guestCart.map((item) =>
        axios.post(import.meta.env.VITE_ADD_TO_CART, {
          user_id: userId,
          product_id: item.product_id,
          productname: item.productname,
          size: item.size || "",
          color: item.color || "",
          discount_price: item.discount_price || 0,
          customer_mrp: item.customer_mrp || 0,
          qty: item.qty,
          img1: item.img1 || "",
        })
      )
    );

    localStorage.removeItem("guest_cart");
  } catch (err) {
    console.error("Sync failed:", err);
  }
};


const fetchCart = async (userId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GET_CART}?user_id=${userId}`
    );

    if (response.data.success) {
      setCart(response.data.cart || []);
    } else {
      setCart([]);
    }
  } catch (err) {
    console.error("Failed to fetch cart", err);
    setCart([]);
  }
};


const initializeCartAfterLogin = async (userId) => {
  await syncGuestCartToDB(userId);
  await fetchCart(userId);
};



useEffect(() => {
  const loadCart = async () => {
    // Guest
    if (!user?.accountid) {
      const saved = localStorage.getItem("guest_cart");
      if (saved) {
        try {
          setCart(JSON.parse(saved));
        } catch {
          localStorage.removeItem("guest_cart");
          setCart([]);
        }
      } else {
        setCart([]);
      }
      return;
    }

    // Logged-in
    await fetchCart(user.accountid);
  };

  loadCart();
}, [user?.accountid]);


  useEffect(() => {
  if (!user?.accountid) {
    localStorage.setItem("guest_cart", JSON.stringify(cart));
  }
}, [cart, user?.accountid]);

  // ================= ADD TO CART =================
// src/context/CartContext.jsx - only replace handleAddToCart
const handleAddToCart = async ({
  product,           // parent
  children = [],
  matchingChild,     // optional: pre-found child from Shop
  isSimple,
  selectedSize,
  selectedColor,
  selectedQty,
  getStockForCombo,
  defaultSize = "One Size",
  defaultColor = "Default",
  hasCupSizes = false,
}) => {
  const user_id = user?.accountid;

  let finalProduct = product;
  let childId = product.productid;

  // Step 1: Determine the actual variant/child to add
  if (!isSimple) {
    let selectedVariant = matchingChild;

    // If Shop didn't pre-find it, find here (fallback)
    if (!selectedVariant) {
      if (hasCupSizes) {
        // Bra product: split selectedSize like "32B" → band "32", cup "B"
        const band = selectedSize.match(/^\d+/)?.[0]; // e.g., "32"
        const cup = selectedSize.replace(/^\d+/, "").trim().toUpperCase(); // e.g., "B"

        if (!band || !cup) {
          toast.error("Invalid size format selected");
          return;
        }

        selectedVariant = children.find((c) => {
          const sizeMatch = String(c.size) === String(band);
          const cupMatch = (c.cup_size || "").toUpperCase() === cup;
          const colorMatch = (c.color || "").toLowerCase() === (selectedColor || "").toLowerCase();
          return sizeMatch && cupMatch && colorMatch && Number(c.stock) > 0;
        });
      } else {
        // Normal product
      selectedVariant = children.find((c) => {
        const sizeMatch = String(c.size) === String(selectedSize);
        const colorMatch = (c.color || "").toLowerCase() === (selectedColor || "").toLowerCase();
        return sizeMatch && colorMatch && Number(c.stock) > 0;
      });
      }
    }

    // if (!selectedVariant) {
    //   toast.error("Selected size/color combination not available");
    //   return;
    // }



    // Build cart item: CHILD data first + parent display fields
    finalProduct = {
      ...selectedVariant,
      productname: product.productname,   // Use parent's name for display
      slug: product.slug,
      images: product.images || selectedVariant.images || {},
      displayed_size: selectedSize,       // keep "32B" for UI
      parent_productid: product.productid,
    };

    childId = selectedVariant.productid;  // REAL CHILD SKU
  } else {
    // Simple product: use parent
    finalProduct = {
      ...product,
      size: defaultSize,
      color: defaultColor,
      displayed_size: "One Size",
    };
    childId = product.productid;
  }

  // Step 2: Build payload (same for guest & logged-in)
  const payload = {
    user_id,  // null for guest
    product_id: childId,                      // CHILD ID (fixed!)
    productname: finalProduct.productname,
    size: selectedSize || defaultSize,        // send "32B" or "M"
    color: selectedColor || defaultColor,
    discount_price: finalProduct.discount_price || product.discount_price || 0,
    customer_mrp: finalProduct.customer_mrp || product.customer_mrp,
    qty: selectedQty,
    img1: finalProduct.images?.img1 || product.images?.img1 || "",
    parent_productid: product.productid,      // optional
    displayed_size: finalProduct.displayed_size,
  };

  console.log("Adding to cart - PAYLOAD:", payload);

  // Step 3: Guest → local only
  if (!user_id) {
    setCart((prev) => {
      const exists = prev.find((i) => i.product_id === payload.product_id);
      if (exists) {
        return prev.map((i) =>
          i.product_id === payload.product_id
            ? { ...i, qty: i.qty + selectedQty }
            : i
        );
      }
      return [...prev, { ...payload, id: Date.now(), selected: true }];
    });

    toast.success("Added to cart");
    return;
  }

  // Step 4: Logged-in → send to backend
  try {
    const response = await axios.post(import.meta.env.VITE_ADD_TO_CART, payload);

    if (response.data.success) {
      setCart((prev) => {
        const exists = prev.find((item) => item.product_id === payload.product_id);
        if (exists) {
          return prev.map((item) =>
            item.product_id === payload.product_id
              ? { ...item, qty: item.qty + selectedQty }
              : item
          );
        }
        return [...prev, { ...payload, id: Date.now(), selected: true }];
      });

      toast.success(response.data.message || "Added to cart successfully!");
      fetchCart(user?.accountid);
    } else {
      toast.error(response.data.message || "Failed to add to cart");
    }
  } catch (err) {
    console.error("Add error:", err);
    toast.error("Failed to add to cart. Try again.");
  }
};
  // ================= REMOVE =================
  const removeFromCart = async (id) => {
    // Update local state first (optimistic UI)
    setCart((prev) => prev.filter((i) => i.id !== id));

    if (!user?.accountid) return;

    try {
      await axios.post(import.meta.env.VITE_REMOVE_CART_ITEMS, { id });
      // fetchCart();
    } catch {
      toast.error("Failed to remove item from server");
      // Revert on failure (optional)
      // fetchCart();
    }
  };

  // ================= UPDATE QTY / SELECT =================
  const updateCart = async (id, updates) => {
    // Optimistic update
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    if (!user?.accountid) return;

    try {
      await axios.post(import.meta.env.VITE_UPDATE_CART_QTY, { id, ...updates });
      fetchCart(user?.accountid);
    } catch {
      toast.error("Failed to update cart");
      // Revert on failure (optional)
      // fetchCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        handleAddToCart,
        removeFromCart,
        updateCart,
        initializeCartAfterLogin,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);


