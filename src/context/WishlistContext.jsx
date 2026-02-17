// src/context/WishlistContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const {user} = useAuth();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mywishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist from localStorage", e);
        localStorage.removeItem("mywishlist");
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("mywishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const loadWishlist = async () => {
    const user_id = user?.accountid;

    if (!user_id) {
      // Guest: use localStorage only
      const saved = localStorage.getItem("mywishlist");
      if (saved) {
        try {
          setWishlist(JSON.parse(saved));
        } catch (e) {
          setWishlist([]);
        }
      }
      return;
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_GET_WISHLIST}?user_id=${user_id}`);
      if (res.data.success) {
        setWishlist(res.data.wishlist || []);
      } else {
        toast.error(res.data.message || "Failed to load wishlist");
        console.warn("Load wishlist failed:", res.data);
      }
    } catch (err) {
      console.error("Error loading wishlist:", err);
      toast.error("Unable to connect to server");
      // Fallback to localStorage even for logged-in user
      const saved = localStorage.getItem("mywishlist");
      if (saved) setWishlist(JSON.parse(saved));
    }
  };

  // const toggleWishlist = async (product) => {
  //   const user_id = user?.accountid;

  //   const item = {
  //     product_id: product.productid,
  //     productname: product.productname,
  //     customer_mrp: product.customer_mrp,
  //     discount_price: product.discount_price,
  //     special_price: product.special_price || null,
  //     img1: product.images?.cover || product.images?.img1 || "",
  //     slug: product.slug,
  //   };

  //   if (!user_id) {
  //   return { requiresLogin: true };
  // }

  //   try {
  //     const res = await axios.post(import.meta.env.VITE_TOGGLE_WISHLIST, {
  //       user_id,
  //       product_id: item.product_id,
  //     });

  //     if (res.data.success) {
  //       if (res.data.action === "added") {
  //         toast.success("Added to wishlist ❤️");
  //         setWishlist((prev) => [...prev, item]);
  //       } else if (res.data.action === "removed") {
  //         toast.info("Removed from wishlist");
  //         setWishlist((prev) => prev.filter((i) => i.product_id !== item.product_id));
  //       }
  //     } else {
  //       toast.error(res.data.message || "Failed to update wishlist");
  //     }
  //   } catch (err) {
  //     console.error("Toggle wishlist error:", err);
  //     toast.error("Network error. Try again.");
  //     // Optional: fallback to local toggle on failure
  //     // setWishlist((prev) => { ...local toggle logic... });
  //   }
  //   return { requiresLogin: false };
  // };


  // src/context/WishlistContext.jsx

const toggleWishlist = async (product) => {
  const user_id = user?.accountid;

  // Early return + trigger login popup if not logged in
  if (!user_id) {
    // Optional: you can trigger toast here too, or let the caller do it
    toast.warning("Please log in to save items to your wishlist", {
      autoClose: 4000,
    });

    // If you have a global login ref or a way to open login modal from context
    // (recommended: use a global event or context for auth actions)
    // For now, just return flag (or throw if you prefer)
    return { requiresLogin: true };
  }

  const item = {
    product_id: product.productid,
    productname: product.productname,
    customer_mrp: product.customer_mrp,
    discount_price: product.discount_price,
    special_price: product.special_price || null,
    img1: product.images?.cover || product.images?.img1 || "",
    slug: product.slug,
  };

  try {
    const res = await axios.post(import.meta.env.VITE_TOGGLE_WISHLIST, {
      user_id,
      product_id: item.product_id,
    });

    if (res.data.success) {
      if (res.data.action === "added") {
        toast.success("Added to wishlist ❤️");
        setWishlist((prev) => [...prev, item]);
      } else if (res.data.action === "removed") {
        toast.info("Removed from wishlist");
        setWishlist((prev) => prev.filter((i) => i.product_id !== item.product_id));
      }
    } else {
      toast.error(res.data.message || "Failed to update wishlist");
    }
  } catch (err) {
    console.error("Toggle wishlist error:", err);
    toast.error("Network error. Try again.");
  }

  return { requiresLogin: false };
};



  const removeFromWishlist = async (product_id) => {
    const user_id = user?.accountid;

    // Always update local state first for instant UI feedback
    setWishlist((prev) => prev.filter((i) => i.product_id !== product_id));

    if (!user_id) {
      toast.info("Removed from wishlist");
      return;
    }

    try {
      const res = await axios.post(import.meta.env.VITE_REMOVE_WISHLIST, {
        user_id,
        product_id
      });

      console.log(res.data);
      
      if (res.data.success) {

    toast.info("Removed from wishlist");
      } else {
        toast.error(res.data.err || "Failed to remove from wishlist");
        // Revert local state on failure
        loadWishlist();
      }
    } catch (err) {
      console.error("Remove wishlist error:", err);
      toast.error("Failed to remove. Try again.");
      // Revert on network error
      loadWishlist();
    }
  };

  const isInWishlist = (product_id) => {
    return wishlist.some((i) => i.product_id === product_id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        loadWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);