import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import cat1 from "../assets/category/cat1.webp";
import cat2 from "../assets/category/cat2.webp";
import cat3 from "../assets/category/cat3.webp";
import cat4 from "../assets/category/cat4.webp";
import cat5 from "../assets/category/cat5.webp";
import cat6 from "../assets/category/cat6.webp";
import cat7 from "../assets/category/cat7.webp";
import { useNavigate } from "react-router-dom";


const categories = [
  { id: 1, img: cat1, name: "Bras" },
  { id: 2, img: cat2, name: "Sleepwear" },
  { id: 3, img: cat3, name: "Winterwear" },
  { id: 4, img: cat4, name: "Panties" },
  { id: 5, img: cat5, name: "Shapewear" },
  { id: 6, img: cat6, name: "Sportwear" },
  { id: 7, img: cat7, name: "Saree" },
];

const CategoryCarousel = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate(); // ← Hook to navigate


  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 200;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  //  const handleCategoryClick = (categoryName) => {
  //   // You can pass category as a query param or route param if needed
  //   navigate(`/shop?category=${categoryName.toLowerCase()}`);
  // };

   const handleCategoryClick = () => {
    navigate(`/shop`);
  };

  return (
    <div className="category-carousel-container">
      {/* Left Arrow */}
      <Button
        variant="light"
        className="carousel-arrow left"
        onClick={() => scroll("left")}
      >
        <FaArrowLeft />
      </Button>

      {/* Scrollable Row */}
      <div className="category-carousel" ref={scrollRef}>
        {categories.map((cat) => (
          <div className="category-item" key={cat.id} onClick={handleCategoryClick}>
            <div className="circle-image">
              <img src={cat.img} alt={cat.name} />
            </div>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
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
