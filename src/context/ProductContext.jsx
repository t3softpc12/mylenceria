import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";  // Assuming you already have AuthContext

const ProductContext = createContext();

const CATEGORY_API_URL = import.meta.env.VITE_FETCH_CATEGORY;
// const PRODUCT_API_URL = import.meta.env.VITE_CATEGORY_WISE_PRODUCTS;

const PARENT_API = import.meta.env.VITE_FETCH_PARENT_PRODUCTS;
const VARIANT_API = import.meta.env.VITE_FETCH_CHILD_VARIANTS;

export const ProductProvider = ({ children }) => {
  const [parents, setParents] = useState([]);  // Parent products (configurable)
  const [productMap, setProductMap] = useState({});  // Parent ID -> Children[]
  const [categories, setCategories] = useState([]);  // Categories from API
  const [selectedCategory, setSelectedCategory] = useState("");  // Selected category
  const [availableColors, setAvailableColors] = useState([]);  // Colors for filtering
  const { user } = useAuth();  // Get user from AuthContext
  const [searchMode, setSearchMode] = useState(false);     // Are we in search results mode?
  const [searchTerm, setSearchTerm] = useState("");       // Current search keyword
  const [searchParents, setSearchParents] = useState([]); //

const [variants, setVariants] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_API_URL);
      // console.log("Raw categories from API:", response.data);
      setCategories(response.data);   // ← array of objects

    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };
  fetchCategories();
}, []);


  const fetchParents = async (category) => {
  setLoading(true);
  const res = await axios.get(PARENT_API, {
    params: { category }
  });
  setParents(res.data.products || []);
  setLoading(false);
};

const fetchVariants = async (parentId, size = "", color = "") => {
  try {
    setLoading(true);
    const res = await axios.get(VARIANT_API, {
      params: { parent_id: parentId, size, color }
    });
    
    const variants = res.data.variants || [];
    
    // Merge into productMap (don't overwrite unrelated parents)
    setProductMap(prev => ({
      ...prev,
      [parentId]: variants,
    }));
    
    return variants;
  } catch (err) {
    console.error("fetchVariants error:", err);
    return [];
  } finally {
    setLoading(false);
  }
};


// const fetchVariants = async (parentId, size = "", color = "") => {
//   console.log(`[fetchVariants] START - parentId: ${parentId} | size: "${size}" | color: "${color}"`);

//   setLoading(true);
//   try {
//     const res = await axios.get(VARIANT_API, {
//       params: { parent_id: parentId, size, color }
//     });

//     console.log(`[fetchVariants] RESPONSE STATUS: ${res.status}`);
//     console.log(`[fetchVariants] RAW DATA:`, res.data);

//     const variants = res.data.variants || res.data || []; // fallback if structure varies

//     console.log(`[fetchVariants] PARSED VARIANTS COUNT: ${variants.length}`);
//     if (variants.length > 0) {
//       console.log(`[fetchVariants] First variant example:`, variants[0]);
//     }

//     // Use String key to avoid number/string issues
//     const key = String(parentId);
//     setProductMap(prev => {
//       const newMap = {
//         ...prev,
//         [key]: variants,
//       };
//       console.log(`[fetchVariants] Updated productMap for ${key} → ${variants.length} items`);
//       console.log(`[fetchVariants] Current productMap keys:`, Object.keys(newMap));
//       return newMap;
//     });

//     return variants;
//   } catch (err) {
//     console.error(`[fetchVariants] ERROR for ${parentId}:`, err.message);
//     if (err.response) {
//       console.error("[fetchVariants] Response status/data:", err.response.status, err.response.data);
//     }
//     return [];
//   } finally {
//     setLoading(false);
//   }
// };



useEffect(() => {
  if (selectedCategory) {
    fetchParents(selectedCategory);
  }
}, [selectedCategory]);



// const onVariantSelect = (parentId, size, color) => {
//   fetchVariants(parentId, size, color);
// };



  return (



<ProductContext.Provider value={{
  parents,
  setParents,               // optional but useful
  productMap,
  setProductMap,
  variants,                 // if still needed
  categories,
  selectedCategory,
  setSelectedCategory,
  loading,
  fetchParents,
  fetchVariants,

  // ── Add these ──
  searchMode,
  setSearchMode,
  searchTerm,
  setSearchTerm,
  searchParents,
  setSearchParents,

}}>
  {children}
</ProductContext.Provider>



  );
};

export const useProducts = () => useContext(ProductContext);
