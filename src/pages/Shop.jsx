import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import FilterSidebar from "../components/FilterSidebar";

const Shop = () => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const { parents, productMap, getSizes, getColors } = useProducts();
  const { addToCart } = useCart();
  const [filters, setFilters] = useState({});

  const toggleLike = (id) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const goToDetail = (productid) => {
    navigate(`/detail/${productid}`);
  };

  const handleAddToCartClick = (item) => {
    setSelectedProduct(item);
    setSelectedSize("");
    setShowSizeModal(true);
  };

  const handleConfirmAdd = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart!");
      return;
    }

    addToCart({
      ...selectedProduct,
      size: selectedSize, // ✅ replaces size array with the selected one
    });

    setShowSizeModal(false);
  };

  const cleanPrice = (p) => Number(p.replace(/[₹,]/g, "").trim()) || 0;

  // filter products
const filteredProducts = parents.filter((p) => {
  const priceValue = cleanPrice(p.customer_mrp);

  const priceOk =
    !filters.priceRange ||
    (priceValue >= filters.priceRange[0] &&
      priceValue <= filters.priceRange[1]);

  // 🔥 GET CHILD COLORS FOR THIS PARENT
  const childColors = getColors(p.productid);  // << FIX

  const colorOk =
    !filters.colors?.length || childColors.some((c) => filters.colors.includes(c));

  const styleOk =
    !filters.styles?.length || filters.styles.includes(p.category);

  return priceOk && colorOk && styleOk;
});

  return (
    <>
      <div className="custom-container d-flex py-0">
        <div className="">
          <FilterSidebar onFilterChange={setFilters} />
        </div>

        <div className="product-section">
          <div className="row gx-3 gy-5">
            {filteredProducts.map((item) => (
              <div key={item.productid} className="col-6 col-md-4 col-lg-3">
                <div className="card h-100 border-0 position-relative product-card">
                  {/* Like Icon */}
                  <div
                    className="position-absolute top-0 end-0 p-2"
                    onClick={() => toggleLike(item.productid)}
                    style={{ cursor: "pointer", zIndex: 10 }}
                  >
                    {liked.includes(item.productid) ? (
                      <FaHeart color="#ff4d6d" size={20} />
                    ) : (
                      <FaRegHeart color="#ff4d6d" size={20} />
                    )}
                  </div>

                  {/* Image */}
                  <img
                    src={
                      hovered === item.productid && item.images.img1
                        ? `${item.images.img1}`  // Full URL for img1
                        : `${item.images.cover}` // Default to cover image
                    }
                    alt={item.productname}
                    className="w-100"
                    style={{
                      height: "65vh",
                      objectFit: "cover",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.4s ease",
                    }}
                    onMouseEnter={() => setHovered(item.productid)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() => goToDetail(item.productid)}
                  />

                  {/* Card Body */}
                  <div className="card-body p-3">
                    <h6 className="card-title mb-2 fw-medium">{item.productname}</h6>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "#999",
                            fontSize: "13px",
                            marginRight: "6px",
                          }}
                        >
                          {item.customer_mrp}
                        </span>
                        <span
                          style={{
                            color: "#ff4d6d",
                            fontWeight: "600",
                            fontSize: "15px",
                          }}
                        >
                          {item.special_price}
                        </span>
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
        </div>
      </div>

      {/* Size Selection Modal */}
      <Modal show={showSizeModal} onHide={() => setShowSizeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <p className="fw-semibold">{selectedProduct.productname}</p>
              <div className="d-flex flex-wrap gap-2">
                {/* {selectedProduct.size.map((s) => ( */}
                {getSizes(selectedProduct.productid).map((s) => (

                  <Button
                    key={s}
                    variant={selectedSize === s ? "danger" : "outline-danger"}
                    size="sm"
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSizeModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmAdd}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Shop;
