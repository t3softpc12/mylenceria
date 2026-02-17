import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext"; // ← Import this

const IMAGE_BASE_URL = import.meta.env.VITE_ASSETS;

const CategoryCarousel = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Get categories from shared context (already fetched once)
  const { categories, loading,setSelectedCategory } = useProducts();

  // Optional: format if needed (but ideally keep consistent with navbar)
  const formattedCategories = categories.map((cat, idx) => ({
    id: idx + 1,
    name: typeof cat === "string" ? cat : cat.categoryName || cat.name || "Unnamed",
    img: typeof cat === "string" ? "" : cat.categoryImage || cat.image || "",
  })).filter(cat => cat.name && (cat.img || true)); // allow categories without image

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 240;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // const handleCategoryClick = (name) => {
  //   navigate(`/shop?category=${encodeURIComponent(name.toLowerCase())}`);
  // };


  const handleCategoryClick = (name) => {
  const categoryName = name.charAt(0).toUpperCase() + name.slice(1); // optional normalize
  setSelectedCategory(categoryName);                    // ← same as navbar
  localStorage.setItem("selectedCategory", categoryName); // same as navbar
  navigate("/shop");  // clean URL, no ?category=
};

  if (loading) {
    return (
      <div className="category-carousel-container">
        <div className="category-carousel">
          {[...Array(5)].map((_, i) => (
            <div className="category-item" key={i}>
              <div className="circle-image" style={{ background: "#eee" }} />
              <div style={{ height: "16px", width: "60px", background: "#eee", margin: "8px auto", borderRadius: "4px" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // No categories → hide or show placeholder
  if (formattedCategories.length === 0) {
    return null; // or <div className="text-center py-3">No categories available</div>
  }

  return (
    <div className="category-carousel-container">
      <Button
        variant="light"
        className="carousel-arrow left"
        onClick={() => scroll("left")}
      >
        <FaArrowLeft />
      </Button>

      <div className="category-carousel" ref={scrollRef}>
        {formattedCategories.map((cat) => (
          <div
            className="category-item"
            key={cat.id}
            onClick={() => handleCategoryClick(cat.name)}
            style={{ cursor: "pointer" }}
          >
            <div className="circle-image">
              {cat.img ? (
              <img
                src={`${IMAGE_BASE_URL}category/${cat.img}`}
                alt={cat.name}
                loading="lazy"
                onError={(e) => {
                    e.target.src = "/images/fallback-circle.png"; // your fallback
                }}
              />
              ) : (
                <div className="no-image-placeholder" />
              )}
            </div>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>

      <Button
        variant="light"
        className="carousel-arrow right"
        onClick={() => scroll("right")}
      >
        <FaArrowRight />
      </Button>
    </div>
  );
};

export default CategoryCarousel;