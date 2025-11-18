import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ProductContext = createContext();

const CATEGORY_API_URL = import.meta.env.VITE_FETCH_CATEGORY;
const PRODUCT_API_URL = import.meta.env.VITE_FETCH_PRODUCTS;

export const ProductProvider = ({ children }) => {
  const [parents, setParents] = useState([]);       // parent products (configurable)
  const [productMap, setProductMap] = useState({}); // parent_id → children[]
  const [categories, setCategories] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract color from product name
  const COLOR_WORDS = [
    "White","Black","Red","Blue","Denim Blue","Denim","Pink","Green",
    "Yellow","Beige","Brown","Purple","Maroon","Navy","Sky Blue",
    "Grey","Gray","Orange","Cream","Lavender"
  ];

  function extractColor(name) {
    if (!name) return null;

    const lower = name.toLowerCase();

    for (let c of COLOR_WORDS.sort((a, b) => b.length - a.length)) {
      if (lower.includes(c.toLowerCase())) {
        return c;
      }
    }
    return null;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(PRODUCT_API_URL);
        const categoryResponse = await axios.get(CATEGORY_API_URL);

        const productData = productResponse.data;

        // Convert API object to array of parents
        const parentList = Object.values(productData).map((p) => p.parent);

        // Map children to each parent_id
        const mapChildren = {};
        Object.entries(productData).forEach(([parentId, item]) => {
          const processed = item.children.map((child) => ({
            ...child,
            color: extractColor(child.productname), // auto color detection
            // color: child.color || null
          }));
          mapChildren[parentId] = processed;
        });

        // console.log("Parent list", parentList);
        let colorSet = new Set();

        Object.values(mapChildren).forEach(childrenList => {
          childrenList.forEach(child => {
            if (child.color) colorSet.add(child.color);
          });
        });

        setAvailableColors([...colorSet]);

        setParents(parentList);     // store parents only
        setProductMap(mapChildren); // parentId → children[]
        setCategories(categoryResponse.data);

      } catch (err) {
        console.error("Error fetching product data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get parent by ID
  const getProductById = (id) =>
    parents.find((p) => p.productid === String(id)) || null;

  // Get children SKUs for a parent ID
  const getChildrenByParentId = (id) =>
    productMap[id] || [];

  // Get sizes for a parent product
  const getSizes = (id) =>
    [...new Set((productMap[id] || []).map((c) => c.size))];

  // Get colors available for a parent product
  const getColors = (id) =>
    [...new Set((productMap[id] || []).map((c) => c.color).filter(Boolean))];

  return (
    <ProductContext.Provider
      value={{
        parents,
        productMap,
        categories,
        loading,
        getProductById,
        getChildrenByParentId,
        getSizes,
        getColors,
        availableColors, 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
