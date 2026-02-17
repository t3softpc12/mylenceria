import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useProducts } from "../context/ProductContext"; // Import ProductContext
import { useCart } from "../context/CartContext"; // Cart Context
import FilterSidebar from "../components/FilterSidebar";
import { useSearch } from "../context/SearchContext"; // For search query
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";
import ValidateUser from "../components/ValidateUser";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Shop = () => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const { handleAddToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [filters, setFilters] = useState({});
  const { searchQuery } = useSearch(); // From navbar search
  const profileRef = React.useRef();
  const loginRef = useRef();
  const { user, openLoginPopup } = useAuth();

  const {
    parents,
    productMap,
    getColors,
    loading,
    selectedCategory,
    searchMode,
    setSearchMode,
    searchTerm,
    setSearchTerm,
    searchParents,
    setSearchParents,
    fetchVariants,
  } = useProducts();
  // console.log(parents);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search");

    if (q) {
      setSearchMode(true);
      setSearchTerm(q);

      // Fetch search results via your existing search API
      const fetchSearchResults = async () => {
        try {
          const response = await axios.get(
            import.meta.env.VITE_PRODUCT_SEARCH,
            {
              params: { q },
            },
          );

          if (response.data.success) {
            const results = response.data.products || [];
            setSearchParents(results);
          }
        } catch (err) {
          console.error("Search fetch error:", err);
          setSearchParents([]);
        }
      };

      fetchSearchResults();
    } else {
      setSearchMode(false);
      setSearchTerm("");
      setSearchParents([]);
    }
  }, [location.search, setSearchMode, setSearchTerm, setSearchParents]);

  const displayProducts = searchMode ? searchParents : parents;

  // If no products in search, show message
  if (searchMode && displayProducts.length === 0 && !loading) {
    return (
      <div className="custom-container text-center py-5">
        <h4>No products found for "{searchTerm}"</h4>
        <Button variant="outline-danger" onClick={() => navigate("/shop")}>
          Back to Shop
        </Button>
      </div>
    );
  }

  const goToDetail = (productid) => {
    // console.log("DEBUG: Navigating with ID:", productid, typeof productid); // Log before setting/navigating
    localStorage.setItem("selectedProductId", productid);
    navigate(`/detail/${productid}`);
  };

  const handleAddToCartClick = (item) => {
    if (item.productcategory === "simple") {
      console.log("item.productcategory", item.productcategory);
      return;
    }

    console.log("Opening modal for product:", item.productid, item.productname);

    setSelectedProduct(item);
    setSelectedSize("");
    setSelectedColor("");
    setSelectedQty(1);

    // Important: Fetch all variants for this parent (no filter first)
    fetchVariants(item.productid, "", ""); // ← add this

    console.log("Just called fetchVariants for:", item.productid);
    setShowSizeModal(true);
  };

  // const handleConfirmAdd = () => {
  //   if (!selectedProduct) return;
  //   handleAddToCart({
  //     product: selectedProduct, // parent
  //     children: productMap[selectedProduct.productid] || [], // variants
  //     isSimple: false,
  //     selectedSize,
  //     selectedColor,
  //     selectedQty,
  //     getStockForCombo: (size, color) => {
  //       const child = productMap[selectedProduct.productid]?.find(
  //         (c) =>
  //           String(c.size) === String(size) &&
  //           String(c.color) === String(color) &&
  //           Number(c.stock) > 0
  //       );
  //       return child?.stock || 0;
  //     },
  //   });
  //   console.log("children", productMap[selectedProduct.productid]);
  //   setShowSizeModal(false);
  // };

  // const handleConfirmAdd = () => {
  //   if (!selectedProduct) return;

  //   const children = productMap[String(selectedProduct.productid)] || [];

  //   // Find matching child (you already have this logic in CartContext, but do it here for certainty)
  //   const matchingChild = children.find(
  //     (c) =>
  //       String(c.size) === String(selectedSize) &&
  //       String(c.color) === String(selectedColor) &&
  //       Number(c.stock) > 0
  //   );

  //   console.log("matchingChild", matchingChild);

  //   if (!matchingChild) {
  //     toast.error("Selected size/color not available");
  //     return;
  //   }

  //   console.log("Passing child to cart:", matchingChild.productid);

  //   handleAddToCart({
  //     product: selectedProduct,          // parent (for fallback name/image)
  //     children,                          // full list (optional now)
  //     matchingChild,                     // ← NEW: send the exact child SKU
  //     isSimple: false,
  //     selectedSize,
  //     selectedColor,
  //     selectedQty,
  //     getStockForCombo: (size, color) => {
  //       const child = children.find(
  //         (c) =>
  //           String(c.size) === String(size) &&
  //           String(c.color) === String(color) &&
  //           Number(c.stock) > 0
  //       );
  //       return child?.stock || 0;
  //     },
  //   });

  //   setShowSizeModal(false);
  // };

  //Size modal to find sku
  const handleConfirmAdd = () => {
    if (!selectedProduct) return;

    const children = productMap[String(selectedProduct.productid)] || [];

    if (children.length === 0) {
      toast.error("No variants available for this product");
      return;
    }

    const hasCupSizes = children.some(
      (c) => c.cup_size && c.cup_size.trim() !== "",
    );

    let matchingChild = null;

    if (hasCupSizes) {
      // Split selectedSize like "32B" → band "32", cup "B"
      const band = selectedSize.match(/^\d+/)?.[0]; // e.g., "32"
      const cup = selectedSize.replace(/^\d+/, "").trim().toUpperCase(); // e.g., "B"

      if (!band || !cup) {
        toast.error("Invalid size format selected");
        return;
      }

      matchingChild = children.find(
        (c) =>
          String(c.size) === String(band) &&
          (c.cup_size || "").toUpperCase() === cup &&
          (c.color || "").trim().toLowerCase() ===
            (selectedColor || "").trim().toLowerCase() &&
          Number(c.stock) > 0,
      );
    } else {
      // Normal product
      matchingChild = children.find(
        (c) =>
          String(c.size) === String(selectedSize) &&
          (c.color || "").trim().toLowerCase() ===
            (selectedColor || "").trim().toLowerCase() &&
          Number(c.stock) > 0,
      );
    }

    console.log("matchingChild:", matchingChild);

    if (!matchingChild) {
      toast.error("Selected size/color not available");
      return;
    }

    console.log("Passing child to cart:", matchingChild.productid);

    handleAddToCart({
      product: selectedProduct,
      children,
      matchingChild,
      isSimple: false,
      selectedSize,
      selectedColor,
      selectedQty,
      getStockForCombo: (size, color) => {
        const child = children.find(
          (c) =>
            String(c.size) === String(size) &&
            String(c.color) === String(color) &&
            Number(c.stock) > 0,
        );
        return child?.stock || 0;
      },
      hasCupSizes, // optional - pass if needed in CartContext
    });

    setShowSizeModal(false);
  };

  const parentId = selectedProduct ? String(selectedProduct.productid) : null;

  const children = parentId ? productMap[parentId] || [] : [];

  const hasCupSizes = children.some(
    (c) => c.cup_size && c.cup_size.trim() !== "",
  );

  const availableColors = [
    ...new Set(children.filter((c) => Number(c.stock) > 0).map((c) => c.color)),
  ];

  const availableSizes = hasCupSizes
    ? Array.from(
        new Set(
          children
            .filter(
              (c) =>
                Number(c.stock) > 0 &&
                (!selectedColor || c.color === selectedColor),
            )
            .map((c) => `${c.size}${c.cup_size ? c.cup_size.trim() : ""}`),
        ),
      ).sort()
    : [
        ...new Set(
          children
            .filter(
              (c) =>
                Number(c.stock) > 0 &&
                (!selectedColor || c.color === selectedColor),
            )
            .map((c) => c.size),
        ),
      ];

  return (
    <>
      <div className="custom-container d-flex py-0 mt-4">
        <div className="product-section w-100">
          {/* Search Header */}
          {searchMode && (
            <div className="mb-4">
              <h4 className="fw-bold">Search Results for "{searchTerm}"</h4>
              <p className="text-muted">
                {displayProducts.length} product
                {displayProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>
          )}
          {/* 
        {!searchMode && selectedCategory && (
          <h4 className="mb-4 fw-bold">{selectedCategory}</h4>
        )} */}

          <div className="row gx-4 gy-5">
            {displayProducts.map((item) => (
              <div key={item.productid} className="col-6 col-md-4 col-lg-3">
                <div className="card h-100 border-0 position-relative product-card">
                  <div
                    className="position-absolute top-0 end-0 p-2"
                    onClick={() => {
                      if (user) {
                        toggleWishlist(item);
                      } else {
                        openLoginPopup();
                      }
                    }}
                    // onClick={() => toggleWishlist(item)}
                    style={{ cursor: "pointer", zIndex: 10 }}
                  >
                    {isInWishlist(item.productid) ? (
                      <FaHeart color="#ff4d6d" size={24} />
                    ) : (
                      <FaRegHeart color="#ff4d6d" size={24} />
                    )}
                  </div>

                  <img
                    src={
                      hovered === item.productid && item.images.img1
                        ? item.images.img1
                        : item.images.cover
                    }
                    alt={item.productname}
                    className="w-100"
                    style={{
                      height: "65vh",
                      // objectFit: "cover",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.4s ease",
                    }}
                    onMouseEnter={() => setHovered(item.productid)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() => goToDetail(item.productid)}
                  />

                  <div className="card-body p-3">
                    <h6 className="card-title mb-2 fw-medium">
                      {item.productname}
                    </h6>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        {/* Calculate the best price */}
                        {(() => {
                          const hasSpecial =
                            item.special_price !== null &&
                            item.special_price > 0;
                          const hasDiscount =
                            item.discount_price !== null &&
                            item.discount_price > 0;
                          const displayPrice = hasSpecial
                            ? item.special_price
                            : hasDiscount
                              ? item.discount_price
                              : item.customer_mrp;

                          const showStrikethrough =
                            hasSpecial ||
                            (hasDiscount &&
                              item.discount_price < item.customer_mrp);

                          return (
                            <>
                              {/* Strikethrough MRP (only if there's a better offer) */}
                              {showStrikethrough && (
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "#999",
                                    fontSize: "13px",
                                    marginRight: "8px",
                                  }}
                                >
                                  ₹{item.customer_mrp}
                                </span>
                              )}

                              {/* Main Display Price (Special > Discount > MRP) */}
                              <span
                                style={{
                                  color: hasSpecial ? "#e91e63" : "#ff4d6d", // Slightly darker pink for special
                                  fontWeight: "700",
                                  fontSize: hasSpecial ? "16px" : "15px",
                                }}
                              >
                                ₹{displayPrice}{" "}
                                {item.customer_mrp > displayPrice && (
                                  <span className="text-success small">
                                    {Math.round(
                                      ((item.customer_mrp - displayPrice) /
                                        item.customer_mrp) *
                                        100,
                                    )}
                                    % off
                                  </span>
                                )}
                              </span>
                              {/* Optional: Special Offer Badge */}
                              {hasSpecial && (
                                <span
                                  className="badge bg-danger ms-2"
                                  style={{
                                    fontSize: "10px",
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                  }}
                                >
                                  SPECIAL!
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleAddToCartClick(item)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show empty state */}
          {displayProducts.length === 0 && !loading && !searchMode && (
            <div
              className="text-center py-5 d-flex align-items-center justify-content-center"
              style={{ minHeight: "90vh" }}
            >
              <div className="py-5">
                {/* Big centered icon / illustration */}
                <div className="mb-5" style={{ opacity: 0.7 }}>
                  <svg
                    width="180"
                    height="180"
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="100" cy="100" r="90" fill="#f8f9fa" />
                    <path
                      d="M60 80 L140 80 M60 100 L140 100 M60 120 L140 120"
                      stroke="#dee2e6"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <circle cx="80" cy="140" r="15" fill="#ff6b6b" />
                    <circle cx="120" cy="140" r="15" fill="#ff6b6b" />
                  </svg>
                </div>

                <h3 className="fw-bold text-dark mb-3">
                  Sorry, this shelf is empty!
                </h3>

                <p
                  className="lead text-muted mb-4 px-3"
                  style={{ maxWidth: "500px", margin: "0 auto" }}
                >
                  No products are available in "
                  {selectedCategory || "this category"}" right now.
                  <br />
                  Why not explore our other collections?
                </p>

                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <button
                    className="btn btn-danger btn-lg px-4 py-2"
                    onClick={() => navigate("/")}
                  >
                    Discover More Styles
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-lg px-5 py-3"
                    onClick={() => navigate("/")}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Size Selection Modal */}
        <Modal
          show={showSizeModal}
          onHide={() => setShowSizeModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <h5 className="">Select Size and Color</h5>
          </Modal.Header>
          <Modal.Body>
            {selectedProduct && (
              <>
                <p className="fw-semibold">{selectedProduct.productname}</p>
                {/* COLORS */}
                <div className="d-flex gap-2 flex-wrap mb-3">
                  {selectedProduct.colors.map((color, index) => {
                    const isAvailable = availableColors.includes(color);
                    const isSelected = selectedColor === color;

                    return (
                      <div
                        key={color}
                        onClick={() => isAvailable && setSelectedColor(color)}
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          cursor: isAvailable ? "pointer" : "not-allowed",
                          backgroundImage: selectedProduct.color_images?.[index]
                            ? `url(${encodeURI(
                                selectedProduct.color_images[index],
                              )})`
                            : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          border: isSelected
                            ? "3px solid #ff2f92"
                            : "2px solid #e5e7eb",
                          opacity: isAvailable ? 1 : 0.35,
                          filter: isAvailable ? "none" : "grayscale(100%)",
                        }}
                      />
                    );
                  })}
                </div>

                {/* SIZES */}
                <div className="d-flex gap-2 flex-wrap">
                  {hasCupSizes
                    ? // Bra: combined sizes like "32B"
                      (() => {
                        const combos = new Set();
                        children.forEach((c) => {
                          if (c.size && c.cup_size && Number(c.stock) > 0) {
                            if (!selectedColor || c.color === selectedColor) {
                              combos.add(`${c.size}${c.cup_size.trim()}`);
                            }
                          }
                        });

                        return Array.from(combos)
                          .sort()
                          .map((combo) => (
                            <button
                              key={combo}
                              disabled={
                                !availableColors.includes(selectedColor) &&
                                selectedColor
                              }
                              onClick={() => setSelectedSize(combo)}
                              style={{
                                minWidth: "50px",
                                height: "38px",
                                borderRadius: "20px",
                                background:
                                  selectedSize === combo ? "#3f3f46" : "#fff",
                                color: selectedSize === combo ? "#fff" : "#000",
                                border:
                                  selectedSize === combo
                                    ? "2px solid #ff4d6d"
                                    : "1.5px solid #d1d5db",
                                opacity: 1,
                                cursor: "pointer",
                                fontWeight: selectedSize === combo ? 600 : 400,
                                boxShadow:
                                  selectedSize === combo
                                    ? "0 0 0 4px rgba(255,77,109,0.2)"
                                    : "none",
                              }}
                            >
                              {combo}
                            </button>
                          ));
                      })()
                    : // Normal sizes
                      selectedProduct.sizes?.map((size) => {
                        const isAvailable = availableSizes.includes(size);
                        const isSelected = selectedSize === size;

                        return (
                          <button
                            key={size}
                            disabled={!isAvailable}
                            onClick={() => isAvailable && setSelectedSize(size)}
                            style={{
                              minWidth: 44,
                              height: 36,
                              borderRadius: 20,
                              background: isSelected ? "#3f3f46" : "#fff",
                              color: isSelected ? "#fff" : "#000",
                              border: isSelected
                                ? "2px solid #ff4d6d"
                                : "1.5px solid #d1d5db",
                              opacity: isAvailable ? 1 : 0.35,
                              cursor: isAvailable ? "pointer" : "not-allowed",
                            }}
                          >
                            {size}
                          </button>
                        );
                      })}
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSizeModal(false)}>
              Cancel
            </Button>
            <Button variant="dark" onClick={handleConfirmAdd}>
              Add to Cart
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div style={{ display: "none" }}>
        <ValidateUser ref={loginRef} />
      </div>
    </>
  );
};

export default Shop;
