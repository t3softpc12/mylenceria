// src/components/ProfileSections/WishlistSection.jsx
import React, { useEffect, useState  } from "react";
import { useWishlist } from "../../context/WishlistContext";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaHeart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { Modal, Button } from "react-bootstrap"; // For size/color modal
import axios from "axios";
import { toast } from "react-toastify";

const WishlistSection = () => {
  const { wishlist, removeFromWishlist, loadWishlist } = useWishlist();
  const { handleAddToCart } = useCart(); 
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [fullProductData, setFullProductData] = useState(null); // Full product from API
  const [loadingProduct, setLoadingProduct] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, []);

const handleAddToCartClick = async (item) => {
  console.log("Wishlist item clicked:", item);

  // Always show loading state
  setSelectedProduct(item); // For displaying name/image while loading
  setLoadingProduct(true);
  setShowModal(true); // Open modal immediately for better UX
  setFullProductData(null);
  setSelectedSize("");
  setSelectedColor("");
  setSelectedQty(1);

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_PRODUCT_DETAILS}?productid=${item.product_id}`
    );

    if (!res.data.success || !res.data.product) {
      toast.error("Failed to load product details");
      setShowModal(false);
      return;
    }

    const { parent: fullProduct, children = [] } = res.data.product;

    // Now we have accurate data → make decision

    // CASE 1: True Simple Product (no variants)
    const isSimpleProduct =
      fullProduct.productcategory === "simple" ||
      fullProduct.productcategory === "Simple" ||
      (children.length === 0 && (!fullProduct.sizes || fullProduct.sizes.length === 0));

    if (isSimpleProduct) {
      // Add directly to cart without modal options
      handleAddToCart({
        product: {
          ...fullProduct,
          productid: fullProduct.productid,
          img1: item.img1 || fullProduct.images?.cover || fullProduct.cover_image,
        },
        isSimple: true,
        selectedQty: 1,
        defaultSize: "One Size",
        defaultColor: "Default",
      });

      toast.success("Added to cart!");
      setShowModal(false); // Close modal since we added directly
      return;
    }

    // CASE 2: Configurable Product → Keep modal open for selection
    setFullProductData({
      ...fullProduct,
      children,
      wishlist_img1: item.img1, // Preserve wishlist thumbnail
    });

    // Optional: Pre-select first available color/size if only one
    if (fullProduct.colors?.length === 1) {
      setSelectedColor(fullProduct.colors[0]);
    }
    if (fullProduct.sizes?.length === 1) {
      const hasCup = children.some(c => c.cup_size && c.cup_size.trim());
      if (hasCup) {
        // Try to find a valid combo
        const firstCombo = children.find(c => c.size && c.cup_size);
        if (firstCombo) setSelectedSize(`${firstCombo.size}${firstCombo.cup_size.trim()}`);
      } else {
        setSelectedSize(fullProduct.sizes[0]);
      }
    }

  } catch (err) {
    console.error("Error loading product details:", err);
    toast.error("Unable to load product. Please try again.");
    setShowModal(false);
  } finally {
    setLoadingProduct(false);
  }
};
const handleConfirmAdd = () => {
  if (!fullProductData || !selectedSize || !selectedColor) {
    toast.warning("Please select size and color");
    return;
  }

  const { children, wishlist_img1, ...product } = fullProductData;

  handleAddToCart({
    product,
    children,
    isSimple: false,
    selectedSize,
    selectedColor,
    selectedQty,
    getStockForCombo: (size) => {
      const hasCup = children.some(c => c.cup_size && c.cup_size.trim());
      if (hasCup) {
        const band = size.match(/^\d+/)?.[0];
        const cup = size.replace(/^\d+/, "").trim();
        const child = children.find(
          c => c.size === band && 
               c.cup_size?.toUpperCase() === cup.toUpperCase() &&
               c.color?.toLowerCase() === selectedColor?.toLowerCase()
        );
        return child ? child.stock : 0;
      } else {
        const child = children.find(
          c => c.size === size && c.color?.toLowerCase() === selectedColor?.toLowerCase()
        );
        return child ? child.stock : 0;
      }
    },
    hasCupSizes: children.some(c => c.cup_size && c.cup_size.trim()),
  });

  setShowModal(false);
  setFullProductData(null);
};
  if (wishlist.length === 0) {
    return (
      <div className="text-center py-5">
        <FaHeart size={60} color="#ddd" />
        <h5 className="mt-3 text-muted">Your wishlist is empty</h5>
        <Link to="/shop" className="btn btn-dark mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
    <div>
      <h4 className="fw-bold mb-4">My Wishlist ({wishlist.length})</h4>

      <div className="row g-4">
        {wishlist.map((item) => {
          const displayPrice =
            item.special_price > 0
              ? item.special_price
              : item.discount_price > 0
                ? item.discount_price
                : item.customer_mrp;

          return (
           <div key={item.product_id} className="col-md-4 col-lg-2">
  <div className="card h-100 border-0 shadow position-relative d-flex flex-column">
    {/* Delete Button */}
    <button
      className="btn btn-sm position-absolute top-0 end-0 mt-2 me-2 z-3"
      onClick={() => removeFromWishlist(item.product_id)}
    >
      <FaTrashAlt color="#ff4d6d" />
    </button>

    {/* Product Image */}
    <Link to={`/detail/${item.product_id}`}>
      <div className="overflow-hidden"> {/* Fixed height container */}
        <img
          src={item.img1 || "/placeholder.jpg"}
          alt={item.productname}
          className="card-img-top w-100 h-100 transition-scale"
          style={{
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>
    </Link>

    {/* Card Body - Takes remaining space and pushes footer down */}
    <div className="card-body d-flex flex-column flex-grow-1 p-3">
      {/* Product Name */}
      <Link
        to={`/detail/${item.product_id}`}
        className="text-decoration-none text-dark mb-2"
      >
        <p className="small mb-0 flex-grow-1">{item.productname}</p>
      </Link>

      {/* Price Section + Add to Cart Button - Pushed to bottom */}
      <div className="mt-auto">
        <div className="mb-3">
          {item.special_price > 0 && (
            <span className="badge bg-danger me-2">SPECIAL!</span>
          )}
          {displayPrice < item.customer_mrp && (
            <del className="text-muted small me-2">₹{item.customer_mrp}</del>
          )}
          <span className="fw-bold text-danger fs-5">₹{displayPrice}</span>
        </div>

        <button
          className="btn btn-sm btn-dark w-100"
          onClick={() => handleAddToCartClick(item)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</div>
          );
        })}
      </div>
    </div>


<Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Select Size & Color</Modal.Title>
  </Modal.Header>
<Modal.Body>
  {loadingProduct ? (
    <div className="text-center py-4">
      <div className="spinner-border text-danger" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading product options...</p>
    </div>
  ) : fullProductData ? (
    <>
      <p className="fw-semibold mb-3">{fullProductData.productname}</p>

      {/* Colors */}
      {fullProductData.colors?.length > 0 && (
        <div className="mb-4">
          <h6>Color</h6>
          <div className="d-flex gap-3 flex-wrap">
            {fullProductData.colors.map((color, idx) => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`border rounded-circle p-1 cursor-pointer ${
                  selectedColor === color ? "border-danger border-3" : "border"
                }`}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundImage: fullProductData.color_images?.[idx]
                      ? `url(${fullProductData.color_images[idx]})`
                      : "linear-gradient(45deg, #ccc, #aaa)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {fullProductData.sizes?.length > 0 && (
        <div>
          <h6>Size</h6>
          <div className="d-flex gap-2 flex-wrap">
            {(() => {
              const hasCup = fullProductData.children.some(
                c => c.cup_size && c.cup_size.trim() !== ""
              );
              if (hasCup) {
                const combos = new Set();
                fullProductData.children.forEach(c => {
                  if (c.size && c.cup_size) {
                    combos.add(`${c.size}${c.cup_size}`);
                  }
                });
                return Array.from(combos)
                  .sort()
                  .map(combo => (
                    <button
                      key={combo}
                      onClick={() => setSelectedSize(combo)}
                      className={`btn px-4 ${
                        selectedSize === combo ? "btn-dark" : "btn-outline-dark"
                      }`}
                    >
                      {combo}
                    </button>
                  ));
              } else {
                return fullProductData.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`btn px-4 ${
                      selectedSize === size ? "btn-dark" : "btn-outline-dark"
                    }`}
                  >
                    {size}
                  </button>
                ));
              }
            })()}
          </div>
        </div>
      )}
    </>
  ) : (
    <p className="text-danger">Failed to load product options.</p>
  )}
</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Cancel
    </Button>
    <Button variant="dark" onClick={handleConfirmAdd} disabled={loadingProduct}>
      Add to Cart
    </Button>
  </Modal.Footer>
</Modal>
  



    </>
  );
};

export default WishlistSection;