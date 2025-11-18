import React from "react";
import { Carousel, Button } from "react-bootstrap";
import banner1 from "../assets/banner1.webp";
import banner2 from "../assets/banner2.webp";
import banner3 from "../assets/banner3.webp";
import banner4 from "../assets/banner4.webp";
import banner5 from "../assets/banner5.webp";
import { useNavigate } from "react-router-dom";

// import "./HeroCarousel.css";

const HeroCarousel = () => {

const navigate = useNavigate();

const handleRedirect = () => {
    navigate("/shop");
};


  return (
    <>
      <Carousel fade interval={2000} className="hero-carousel">
        <Carousel.Item onClick={handleRedirect} style={{ cursor: "pointer" }}>
          <img className="d-block w-100" src={banner1} alt="Slide 1" />
          <Carousel.Caption className="carousel-text">
            <Button variant="dark" className="shop-btn">Shop Now</Button>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item onClick={handleRedirect} style={{ cursor: "pointer" }}>
          <img className="d-block w-100" src={banner2} alt="Slide 2" />
          <Carousel.Caption className="carousel-text">
            <Button variant="dark" className="shop-btn">Shop Now</Button>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item onClick={handleRedirect} style={{ cursor: "pointer" }}>
          <img className="d-block w-100" src={banner3} alt="Slide 3" />
          <Carousel.Caption className="carousel-text">
            <Button variant="dark" className="shop-btn">Shop Now</Button>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item onClick={handleRedirect} style={{ cursor: "pointer" }}>
          <img className="d-block w-100" src={banner4} alt="Slide 3" />
          <Carousel.Caption className="carousel-text">
            <Button variant="dark" className="shop-btn">Shop Now</Button>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item onClick={handleRedirect} style={{ cursor: "pointer" }}>
          <img className="d-block w-100" src={banner5} alt="Slide 3" />
          <Carousel.Caption className="carousel-text">
            <Button variant="dark" className="shop-btn">Shop Now</Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <div className="promo-banner text-center py-2">
        <strong>Get UPTO 30% OFF</strong> on your 1st order <a href="#">SHOP NOW</a>
      </div>
    </>
  );
};

export default HeroCarousel;
