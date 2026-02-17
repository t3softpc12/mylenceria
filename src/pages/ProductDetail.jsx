import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react"; // Added useMemo
import { useParams, Link } from "react-router-dom"; // Removed unused imports
import { useProducts } from "../context/ProductContext";
import { Modal, Button, Accordion } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import Cart from "../pages/Cart";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";
import SizeGuide from "../components/SizeGuide";
import ValidateUser from "../components/ValidateUser";
import { useAuth } from "../context/AuthContext";



const ProductDetail = () => {
  const { productid } = useParams(); // Get product ID from URL
  const { parents } = useProducts(); // Keep parents if needed for fallback, but mainly use API fetch
  const { addToCart } = useCart();
  const { handleAddToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [children, setChildren] = useState([]); // Local state for children from API
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true); // For async parents load
  const [currentMrp, setCurrentMrp] = useState(null);
  const [currentDiscountPrice, setCurrentDiscountPrice] = useState(null);
  const [currentDisplayPrice, setCurrentDisplayPrice] = useState(null);
  const [hasSpecialOffer, setHasSpecialOffer] = useState(false);
  const [colorImagesMap, setColorImagesMap] = useState({});
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedSizeOption, setSelectedSizeOption] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const loginRef = useRef();
  const {user, openLoginPopup } = useAuth();


  // const handleWishlistClick = async () => {
  //   const result = await toggleWishlist(product);

  //   if (result?.requiresLogin) {
  //     loginRef.current?.openPopup();
  //     toast.warning("Log in to save this item to your wishlist ", {
  //       autoClose: 4000,
  //     });
  //   }
  // };

  useEffect(() => {
    if (!productid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_PRODUCT_DETAILS}?productid=${productid}`)
      .then((response) => {
        const data = response.data;
        console.log("Fetched data:", data);
        if (data.success && data.product) {
          setProduct(data.product.parent);
          setChildren(data.product.children || []);
        } else {
          console.error("API Error:", data.message);
          toast.error(data.message || "Failed to load product");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        toast.error("Failed to load product details");
        setLoading(false);
      });
  }, [productid]);

  useEffect(() => {
    if (product?.images) {
      setMainImage(product.images.cover || product.images.img1);
    }
  }, [product]); // Only when product changes

  const allColors = useMemo(() => product?.colors || [], [product]);
  const colorImages = useMemo(() => product?.color_images || [], [product]);

  const hasCupSizes = useMemo(() => {
    return children.some(
      (child) => child.cup_size && child.cup_size.trim() !== "",
    );
  }, [children]);

  useEffect(() => {
    if (allColors.length && colorImages.length) {
      const map = {};
      allColors.forEach((color, index) => {
        map[color] = colorImages[index];
      });
      setColorImagesMap(map);
    }
  }, [allColors, colorImages]); // Stable deps now

  const allSizes = useMemo(() => product?.sizes || [], [product]);

  const availableSizes = useMemo(() => {
    if (!children.length) return allSizes;
    const sizesWithStock = new Set();
    children.forEach((child) => {
      if (child.stock > 0 && child.size && allSizes.includes(child.size)) {
        sizesWithStock.add(child.size);
      }
    });
    return Array.from(sizesWithStock);
  }, [children, allSizes]);

  const availableColors = useMemo(() => {
    if (!children.length) return allColors;
    const colorsWithStock = new Set();
    children.forEach((child) => {
      if (child.stock > 0 && child.color && allColors.includes(child.color)) {
        colorsWithStock.add(child.color);
      }
    });
    return Array.from(colorsWithStock);
  }, [children, allColors]);

  const allPossibleSizes = useMemo(() => {
    if (!children.length) return [];

    const options = new Set();

    children.forEach((child) => {
      if (child.size) {
        // Remove the stock > 0 check here
        if (hasCupSizes && child.cup_size && child.cup_size.trim() !== "") {
          options.add(`${child.size}${child.cup_size}`);
        } else if (!hasCupSizes) {
          options.add(child.size);
        }
      }
    });

    // Sort nicely
    return Array.from(options).sort((a, b) => {
      if (hasCupSizes) {
        const bandA = parseInt(a.match(/\d+/)?.[0] || 0);
        const bandB = parseInt(b.match(/\d+/)?.[0] || 0);
        if (bandA !== bandB) return bandA - bandB;
        return a.localeCompare(b);
      }
      return a.localeCompare(b);
    });
  }, [children, hasCupSizes]);

  const isSizeInStock = useCallback(
    (option) => {
      if (!option) return false;

      if (hasCupSizes) {
        const band = option.match(/\d+/)?.[0];
        const cup = option.replace(/\d+/, "");
        return children.some(
          (c) => c.size === band && c.cup_size === cup && c.stock > 0,
        );
      } else {
        return children.some((c) => c.size === option && c.stock > 0);
      }
    },
    [children, hasCupSizes],
  );

  const getStockForCombo = useCallback(
    (selectedOption) => {
      if (!selectedOption) return 0;

      if (hasCupSizes) {
        const band = selectedOption.match(/\d+/)?.[0];
        const cup = selectedOption.replace(/\d+/, "");
        const child = children.find(
          (c) => c.size === band && c.cup_size === cup,
        );
        return child ? child.stock : 0;
      } else {
        // Regular size
        const child = children.find((c) => c.size === selectedOption);
        return child ? child.stock : 0;
      }
    },
    [children, hasCupSizes],
  );
  // Optional: Show out-of-stock message if nothing available
  const isFullyOutOfStock =
    availableSizes.length === 0 || availableColors.length === 0;

  // Simple product detection
  // console.log("productcategory", product?.productcategory);
  const isSimple = useMemo(
    () => product?.productcategory === "Simple" && !children.length,
    [product, children],
  );

  // Update dynamic price based on selection (SKU/child) or fallback to parent
  // const updatePrice = useCallback(() => {
  //   if (!product) return;

  //   let mrp = null;
  //   let discount = null;
  //   let special = null;

  //   if (isSimple) {
  //     // Simple product: use parent directly
  //     mrp = product.customer_mrp;
  //     discount = product.discount_price;
  //     special = product.special_price; // ← new field from parent query
  //   } else if (selectedSizeOption && selectedColor && children.length > 0) {
  //     let matchingChild;
  //     if (hasCupSizes) {
  //       const band = selectedSizeOption.match(/\d+/)?.[0];
  //       const cup = selectedSizeOption.replace(/\d+/, "");
  //       matchingChild = children.find(
  //         (c) =>
  //           c.size === band && c.cup_size === cup && c.color === selectedColor,
  //       );
  //     } else {
  //       matchingChild = children.find(
  //         (c) => c.size === selectedSizeOption && c.color === selectedColor,
  //       );
  //     }

  //     if (matchingChild) {
  //       mrp = matchingChild.customer_mrp || product.customer_mrp;
  //       discount = matchingChild.discount_price || product.discount_price;
  //       special = matchingChild.special_price; // ← from child query
  //     } else {
  //       // Fallback to parent if no child match
  //       mrp = product.customer_mrp;
  //       discount = product.discount_price;
  //       special = product.special_price;
  //     }
  //   } else {
  //     // No selection yet → use parent
  //     mrp = product.customer_mrp;
  //     discount = product.discount_price;
  //     special = product.special_price;
  //   }

  //   // Set states
  //   setCurrentMrp(mrp);
  //   setCurrentDiscountPrice(discount);

  //   // Determine final display price and special offer flag
  //   if (special !== null && special > 0) {
  //     setCurrentDisplayPrice(special);
  //     setHasSpecialOffer(true);
  //   } else if (discount !== null && discount > 0) {
  //     setCurrentDisplayPrice(discount);
  //     setHasSpecialOffer(false);
  //   } else {
  //     setCurrentDisplayPrice(mrp);
  //     setHasSpecialOffer(false);
  //   }
  // }, [product, isSimple, selectedSize, selectedColor, children]);


  const updatePrice = useCallback(() => {
  if (!product) return;

  let mrp = null;
  let discount = null;
  let special = null;

  if (isSimple) {
    // Simple product: use parent directly (unchanged)
    mrp = product.customer_mrp;
    discount = product.discount_price;
    special = product.special_price;
  } else if (selectedSizeOption && selectedColor && children.length > 0) {
    let matchingChild;
    if (hasCupSizes) {
      const band = selectedSizeOption.match(/\d+/)?.[0];
      const cup = selectedSizeOption.replace(/\d+/, "");
      matchingChild = children.find(
        (c) =>
          c.size === band && c.cup_size === cup && c.color === selectedColor
      );
    } else {
      matchingChild = children.find(
        (c) => c.size === selectedSizeOption && c.color === selectedColor
      );
    }

    if (matchingChild) {
      // Always use child prices when matched
      // But ONLY use discount/special if child actually has them
      mrp = matchingChild.customer_mrp || product.customer_mrp; // child MRP preferred
      discount = matchingChild.discount_price || null;          // no parent fallback
      special = matchingChild.special_price || null;            // no parent fallback
    } else {
      // No matching child → fallback to parent MRP only (no discount/special leak)
      mrp = product.customer_mrp;
      discount = null;
      special = null;
    }
  } else {
    // No selection yet → show parent MRP only (no discount/special)
    mrp = product.customer_mrp;
    discount = null;
    special = null;
  }

  // Set states
  setCurrentMrp(mrp);
  setCurrentDiscountPrice(discount);

  // Determine final display price and special offer flag
  if (special !== null && special > 0) {
    setCurrentDisplayPrice(special);
    setHasSpecialOffer(true);
  } else if (discount !== null && discount > 0) {
    setCurrentDisplayPrice(discount);
    setHasSpecialOffer(false);
  } else {
    setCurrentDisplayPrice(mrp);
    setHasSpecialOffer(false);
  }
}, [product, isSimple, selectedSizeOption, selectedColor, children, hasCupSizes]);

  useEffect(() => {
    updatePrice();
  }, [updatePrice]);

  // Default values for simple products
  const defaultSize = isSimple ? "N/A" : null;
  const defaultColor = isSimple ? "N/A" : null;

  // Loading spinner
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading product...</span>
        </div>
      </div>
    );
  }

  // Not found (now only after loading completes)
  if (!product) {
    return (
      <div className="container py-5 text-center">
        {console.log("takess timeee")}
        {/* <h3>Product not found</h3>
        <Link to="/" className="btn btn-outline-danger mt-3">
          Go Back
        </Link> */}
      </div>
    );
  }

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  return (
    <>
      <div className="container-fluid p-3">
        <div className="row g-3" style={{}}>
          {/* Left Column - Thumbnails + Main Image */}
          <div className="col-md-7 d-flex pe-5">
            {/* Thumbnails */}
            <div
              style={{
                width: "90px",
                overflowY: "scroll",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="me-3"
            >
              {[
                product.images.cover,
                product.images.img1,
                product.images.img2,
                product.images.img3,
                product.images.img4,
                product.images.img5,
              ]
                .filter(
                  (img) => img && typeof img === "string" && img.trim() !== "",
                )
                .map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    onClick={() => setMainImage(img)}
                    style={{
                      width: "80px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      cursor: "pointer",
                      border:
                        mainImage === img
                          ? "2px solid #ff4d6d"
                          : "1px solid #ccc",
                    }}
                    className="img-fluid mb-2"
                  />
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-grow-1 text-center pe-5">
              <img
                src={mainImage}
                alt={product.productname}
                className="img-fluid shadow-sm"
                style={{
                  width: "95%",
                  maxHeight: "80%",
                  // objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div
            className="col-md-5 hide-scrollbar"
            style={{ paddingRight: "10px" }}
          >
            <h3 className="fw-bold text-danger-emphasis mb-1">
              {product.productname}
            </h3>

            <p className="text-muted mb-3">{product.short_description}</p>

            <div className="d-flex align-items-center mb-3 flex-wrap gap-2">
              {/* Final Price (Big & Red) */}
              <h3 className="text-danger fw-bold mb-0">
                ₹{currentDisplayPrice || currentMrp || "Price not available"}
              </h3>

              {/* Show MRP strikethrough only if there's a better offer */}
              {(hasSpecialOffer ||
                (currentDiscountPrice > 0 &&
                  currentDisplayPrice < currentMrp)) && (
                <del className="text-secondary ms-3 align-self-center">
                  ₹{currentMrp}
                </del>
              )}

              {/* Optional: Show savings */}
              {currentMrp && currentDisplayPrice < currentMrp && (
                <small className="">
                  {Math.round(
                    ((currentMrp - currentDisplayPrice) / currentMrp) * 100,
                  )}
                  % off
                </small>
              )}
              {hasSpecialOffer && (
                <span
                  className="badge  ms-3 p-2  rounded-pill"
                  style={{
                    background: "linear-gradient(135deg, #f89fd0ff, #ffccccff)",
                    color: "red",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  Special Offer!
                </span>
              )}
            </div>


            

            <p className="text-secondary" style={{ fontSize: "15px" }}>
              {product.description}
            </p>

            {/* Size Selection (Hidden for simple) */}
            {!isSimple ? (
              <div className="mt-4">
                <h6 className="fw-semibold mb-2">
                  {hasCupSizes ? "Bra Sizes" : "Sizes"}
                </h6>

                {allPossibleSizes.length === 0 && (
                  <p className="text-danger small mb-2">No sizes available.</p>
                )}

                <div className="d-flex flex-wrap gap-2">
                  {allPossibleSizes.map((option) => {
                    const inStock = isSizeInStock(option);
                    const isSelected = selectedSizeOption === option;

                    return (
                      <button
                        key={option}
                        className={`btn btn-outline-dark px-3 py-1 rounded-5 ${
                          isSelected ? "active" : ""
                        } ${!inStock ? "disabled opacity-50" : ""}`}
                        onClick={() => inStock && setSelectedSizeOption(option)}
                        disabled={!inStock}
                        style={{
                          borderColor: isSelected
                            ? "#ff7f73"
                            : inStock
                              ? "rgba(0,0,0,0.2)"
                              : "#ccc",
                          color: isSelected
                            ? "#ff7f73"
                            : inStock
                              ? "#000"
                              : "#999",
                          textDecoration: !inStock ? "line-through" : "none",
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Optional: Show how many are out of stock */}
                {allPossibleSizes.length > 0 &&
                  allPossibleSizes.some((opt) => !isSizeInStock(opt)) && (
                    <p className="text-danger small mt-2">
                      +
                      {
                        allPossibleSizes.filter((opt) => !isSizeInStock(opt))
                          .length
                      }{" "}
                      Sizes Out Of Stock
                    </p>
                  )}

                <Button
                  variant="outline-dark"
                  className="rounded-pill mt-3"
                  onClick={() => setShowSizeGuide(true)}
                >
                  Size Guide
                </Button>

                {/* <button
              className="btn btn-outline-dark btn-sm mt-3"
              onClick={() => setShowSizeGuide(true)}
            >
              Size Guide
            </button> */}
                {/* {console.log("Category for size guide:", product.productsubcategory, product.productcategory)} */}
                <SizeGuide
                  category={product.productsubcategory || product.category} // e.g., "Bras", "Nightwear"
                  show={showSizeGuide}
                  onHide={() => setShowSizeGuide(false)}
                />

                {selectedSizeOption && isSizeInStock(selectedSizeOption) && (
                  <p className="mt-3 fw-bold">
                    Selected Size: {selectedSizeOption}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-4">
                <h6 className="fw-semibold mb-2">
                  <button
                    className={`btn btn-outline-dark px-3 py-1 rounded-5 `}
                    style={{ borderColor: "#ff7f73", color: "#0e0d0dff" }}
                  >
                    One Size
                  </button>
                </h6>
                {/* <p className="text-secondary small">Free Size</p> */}
              </div>
            )}

            {/* Color Selection (Hidden for simple) */}
            {!isSimple ? (
              <div className="mt-4">
                <h6 className="fw-semibold mb-1">Colours</h6>
                {isFullyOutOfStock && (
                  <p className="text-danger small mb-2">
                    This product is currently out of stock.
                  </p>
                )}
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  {allColors.map((color) => {
                    const isAvailable = availableColors.includes(color);
                    return (
                      <div className="color-wrapper" key={color}>
                        <div
                          className={`color-circle ${
                            !isAvailable ? "opacity-50" : ""
                          }`}
                          style={{
                            backgroundImage: colorImagesMap[color]
                              ? `url("${encodeURI(colorImagesMap[color])}")`
                              : "#fff",
                            border:
                              selectedColor === color
                                ? "3px solid #E91E63"
                                : "2px solid #ccc",
                            transform:
                              selectedColor === color
                                ? "scale(1.15)"
                                : "scale(1)",
                            cursor: !isAvailable ? "not-allowed" : "pointer",
                            opacity: !isAvailable ? 0.5 : 1,
                          }}
                          onClick={() =>
                            isAvailable && handleColorSelect(color)
                          }
                        ></div>
                        <span
                          className={`color-tooltip ${
                            !isAvailable ? "line-through" : ""
                          }`}
                        >
                          {color}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <h6 className="fw-semibold mb-1 text-muted">Colour:</h6>
                <p className="text-secondary small">Default color</p>
              </div>
            )}

            {/* Quantity Selection (Enabled for all) */}
            <div className="mt-4">
              <h6 className="fw-semibold mb-0">Select Quantity:</h6>
              <div className="d-flex gap-2 align-items-center">
                <button
                  className="btn btn-outline-dark btn-sm pt-1 px-2 rounded-circle fs-5 fw-bold"
                  onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                >
                  -
                </button>
                <span className="m-3 fw-bold">{selectedQty}</span>
                <button
                  className="btn btn-outline-dark btn-sm py-1 px-2 rounded-circle fs-5 fw-bold"
                  onClick={() => {
                    const maxQty = isSimple
                      ? product.stock || 99
                      : getStockForCombo(selectedSizeOption) || 99;
                    setSelectedQty(Math.min(selectedQty + 1, maxQty));
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div className="mt-3 d-flex flex-wrap align-items-center gap-3">
              <button
                className="btn btn-danger w-75 px-4 py-2 rounded-3 position-relative"
                onClick={() =>
                  handleAddToCart({
                    product,
                    children,
                    isSimple,
                    selectedSize: selectedSizeOption,
                    selectedColor,
                    selectedQty,
                    getStockForCombo,
                    defaultSize,
                    defaultColor,
                    hasCupSizes,
                  })
                }
              >
                Add to Cart
                <FaShoppingCart className="ms-2" />
              </button>

              {/* <button className=" px-4 py-2 border-0 bg-white">
                <FaRegHeart color="#eb274bff" size={30} />
              </button> */}

              <div

               onClick={() => {
                      if (user) {
                        toggleWishlist(product);
                      } else {
                        openLoginPopup();
                      }
                    }}
                
                // onClick={() => toggleWishlist(product)} // ← Use the function that checks login
                style={{ cursor: "pointer", zIndex: 10 }}
              >
                {isInWishlist(product?.productid) ? ( // ← Use product.productid, not productid from params
                  <FaHeart color="#ff4d6d" size={30} />
                ) : (
                  <FaRegHeart color="#ff4d6d" size={30} />
                )}
              </div>
            </div>

            <Link
              to="/"
              className="d-inline-block mt-4 text-decoration-none text-dark"
            >
              ← Back to Shop
            </Link>

            {/* Accordion Section for Description and Details */}
            <div className="mt-5 pt-3 border-top">
              <h6 className="fw-semibold mb-2">Description:</h6>
              <p className="text-secondary" style={{ fontSize: "15px" }}>
                Sculpt, smooth, and support — this Mid-Thigh Bodysuit is
                designed for a flawless fit that feels as good as it looks.
              </p>

              {/* <Accordion flush className="mt-4">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Product Features</Accordion.Header>
                  <Accordion.Body>
                    - Seamless design for invisible comfort <br />
                    - Adjustable straps for a perfect fit <br />
                    - Eco-friendly packaging <br />- Designed to smooth and
                    sculpt curves
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion> */}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "none" }}>
        <ValidateUser ref={loginRef} />
      </div>
      <Cart showCart={showCart} toggleCart={toggleCart} />
    </>
  );
};

export default ProductDetail;
