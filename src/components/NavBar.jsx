import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, FormControl, Button, Navbar } from "react-bootstrap";
import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaBell,
  FaUser,
} from "react-icons/fa";
import logo from "../assets/Logo.svg";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Cart Context
import Cart from "../pages/Cart";
import ValidateUser from "./ValidateUser";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { useSearch } from "../context/SearchContext";
import { useWishlist } from "../context/WishlistContext";
// import { toast } from "react-toastify";

const NavBar = ({}) => {
  const { categories, selectedCategory, setSelectedCategory } = useProducts();
  const [showCart, setShowCart] = useState(false); // Cart modal state
  const navigate = useNavigate();
  const { wishlist, loadWishlist } = useWishlist(); // ← Get wishlist
  const { cart } = useCart(); // Use Cart context
  const cartRef = useRef();
  const profileRef = useRef();
  const { user, openLoginPopup } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    showDropdown,
    setShowDropdown,
    clearSearch,
  } = useSearch();

  // console.log("NavBar received categories:", categories);
  // console.log("NavBar categories length:", categories?.length || 0);
  // console.log("NavBar selectedCategory:", selectedCategory);

  useEffect(() => {
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
      setSelectedCategory(savedCategory);
    }
  }, []);

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const handleProfileClick = () => {
    profileRef.current?.openPopup();
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <>
      {/* === Top Navbar === */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 2000,
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Navbar bg="light" expand="lg" className="border-bottom py-2">
          <Container
            fluid
            className="px-4 d-flex justify-content-between align-items-center"
          >
            {/* Logo */}
            <Navbar.Brand href="/">
              <img src={logo} alt="MyLenceria" height="35" className="me-2" />
            </Navbar.Brand>

            {/* Search */}
            <Form className="d-flex position-relative">
              <FormControl
                type="search"
                placeholder="Search for Bras, Panties, Nightwear, Brands..."
                className="rounded-pill ps-4 pe-5 border-0 shadow-sm"
                style={{ height: "48px", width: "30vw", fontSize: "15px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                // Hide dropdown on blur with small delay so click works
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    clearSearch();
                    navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
              />
              <FaSearch
                style={{
                  position: "absolute",
                  right: "18px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#999",
                  fontSize: "18px",
                  pointerEvents: "none",
                }}
              />
            </Form>

            {/* Live Search Dropdown */}
            {showDropdown && searchQuery.length > 1 && (
              <div
                className="position-absolute bg-white shadow-lg rounded-3 mt-2 overflow-hidden"
                style={{
                  width: "100%",
                  maxHeight: "70vh",
                  overflowY: "auto",
                  zIndex: 3000,
                  border: "1px solid #eee",
                }}
              >
                {searchLoading ? (
                  <div className="p-4 text-center text-muted">
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></div>
                    Searching...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    No products found
                  </div>
                ) : (
                  <>
                    {searchResults.map((product) => (
                      <div
                        key={product.productid}
                        className="d-flex align-items-center p-3 mt-5 border-bottom hover-bg-light"
                        style={{ cursor: "pointer" }}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent blur before click
                          clearSearch();
                          navigate(`/detail/${product.productid}`);
                        }}
                      >
                        <img
                          src={
                            product.images?.cover ||
                            product.images?.img1 ||
                            "/placeholder.jpg"
                          }
                          alt={product.productname}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginRight: "16px",
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold text-dark">
                            {product.productname}
                          </div>
                          <div className="text-muted small">
                            {product.brand}
                          </div>
                        </div>
                        <div className="text-end">
                          {product.discount_price ? (
                            <>
                              <div className="text-danger fw-bold">
                                ₹{product.discount_price}
                              </div>
                              <del className="text-muted small">
                                ₹{product.customer_mrp}
                              </del>
                            </>
                          ) : (
                            <div className="text-danger fw-bold">
                              ₹{product.customer_mrp}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* View All Results Link */}
                    <div
                      className="p-3 text-center bg-light text-danger fw-semibold"
                      style={{ cursor: "pointer" }}
                      onMouseDown={() => {
                        clearSearch();
                        navigate(
                          `/shop?search=${encodeURIComponent(searchQuery)}`,
                        );
                      }}
                    >
                      View all results for "{searchQuery}" →
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Right icons */}
            <div className="d-flex align-items-center">
              <Button
                variant="danger"
                className="rounded-pill px-3 me-4 fw-semibold"
                style={{ backgroundColor: "#ff7f73", border: "none" }}
              >
                New launch 
              </Button>

              <div className="d-flex align-items-center gap-4 fs-5 text-dark">
                <div className="d-flex align-items-center gap-5 fs-5 text-dark">
                  <div
                    className="d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={handleProfileClick}
                  >
                    <FaUser size={22} />
                    <ValidateUser ref={profileRef} />{" "}
                    {/* ValidateUser dropdown */}
                    <div className="d-flex flex-column lh-1"></div>
                  </div>
                </div>
                <div
                  className="position-relative"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (user) {
                      // Logged in → go to wishlist page
                      navigate("/account?section=wishlist");
                    } else {
                      openLoginPopup(); 
                      return;
                    }
                  }}
                >
                  <FaHeart size={22} />

                  {/* Badge - only show if items exist */}

                  
                  {user && wishlist.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-12px",
                        backgroundColor: "#f1274cff",
                        color: "#fff",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {wishlist.length}
                    </div>
                  )}
                </div>

                {/* Cart Icon with Count */}
                <div className="position-relative">
                  <FaShoppingCart
                    className="cursor-pointer"
                    onClick={() => cartRef.current.openCartDrawer()}
                  />
                  {/* Cart Count Badge */}
                  {cart.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-10px",
                        backgroundColor: "#f1274cff",
                        color: "#fff",
                        borderRadius: "50%",
                        padding: "0.2rem 0.4rem",
                        fontSize: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {cart.length}
                    </div>
                  )}
                </div>
                {/* <FaBell /> */}
              </div>
            </div>
          </Container>
        </Navbar>

        {/* === Bottom Menu Line === */}
        <div
          className="border-top border-bottom bg-white w-100 position-relative"
          style={{ zIndex: 1000 }}
        >
          <Container
            fluid
            className="d-flex flex-wrap justify-content-center align-items-center gap-4 py-2"
          >
            {categories.length === 0 ? (
              <span>Loading categories...</span>
            ) : (
              categories.map((category, index) => (
                <div
                  key={category.categoryName || index}
                  className="nav-item position-relative"
                >
                  <button
                    onClick={() => {
                      setSelectedCategory(category.categoryName);
                      localStorage.setItem(
                        "selectedCategory",
                        category.categoryName,
                      );
                      navigate("/shop");
                    }}
                    className="bg-transparent border-0 text-decoration-none text-gradient fw-semibold"
                    style={{
                      fontSize: "14px",
                      borderLeft: index === 0 ? "none" : "1px solid #000",
                      paddingLeft: index === 0 ? "0" : "10px",
                      cursor: "pointer",
                    }}
                  >
                    {category.categoryName}
                  </button>

                  {/* Mega Menu logic */}
                  {category.hasMegaMenu && <div className="mega-menu"></div>}
                </div>
              ))
            )}
          </Container>
        </div>
      </div>

      {/* === Cart Modal === */}
      {/* <Cart showCart={showCart} toggleCart={toggleCart} /> */}
      <Cart ref={cartRef} />
    </>
  );
};

export default NavBar;
