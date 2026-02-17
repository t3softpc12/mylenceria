// src/context/SearchContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SearchContext = createContext();

const SEARCH_API_URL = import.meta.env.VITE_PRODUCT_SEARCH; // You'll add this to .env

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounced search - triggers API call only after user stops typing for 300ms
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get(SEARCH_API_URL, {
          params: { q: searchQuery.trim() },
        });

        if (response.data.success) {
          setSearchResults(response.data.products || []); // Expecting array of parent products
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Search API error:", err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        searchLoading: loading,
        showDropdown,
        setShowDropdown,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);