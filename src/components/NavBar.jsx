import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, FormControl, Button, Navbar } from "react-bootstrap";
import { FaSearch, FaHeart, FaShoppingCart, FaBell, FaUser } from "react-icons/fa";
import logo from "../assets/Logo.svg";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Cart Context
import Cart from "../pages/Cart";
import Profile from "./Profile";
import axios from "axios"; // Axios for API requests

const NavBar = () => {
  const [showCart, setShowCart] = useState(false); // Cart modal state
  const [menuItems, setMenuItems] = useState([]); // State to store dynamic menu items
  const [loading, setLoading] = useState(true); // State to show loading state
  const navigate = useNavigate();
  const { cart } = useCart(); // Use Cart context
  const profileRef = useRef();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state


  // Fetch categories from API on component mount
  useEffect(() => {
    axios.get(import.meta.env.VITE_FETCH_CATEGORY) // API URL from VITE env file
      .then((response) => {
        const categories = response.data.map((category, index) => ({
          id: index + 1,
          label: category,
          path: "/shop", // Assuming all paths lead to /shop, you can modify this logic if needed
          hasMegaMenu: true, // You can adjust this based on your categories
        }));
        setMenuItems(categories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  const handleMenuClick = (item) => {
    navigate(item.path);
    console.log("Navigating to:", item.path);
  };

  // Cart Modal toggle
  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const handleProfileClick = () => {
    profileRef.current?.openPopup();
  };

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
          <Container fluid className="px-4 d-flex justify-content-between align-items-center">
            {/* Logo */}
            <Navbar.Brand href="/">
              <img src={logo} alt="MyLenceria" height="35" className="me-2" />
            </Navbar.Brand>

            {/* Search */}
            <Form className="d-flex mx-auto w-50 position-relative">
              <FormControl
                type="search"
                placeholder="Search for... Panties"
                className="rounded-pill ps-4 pe-5"
                style={{ border: "1px solid #ddd", boxShadow: "none", height: "40px" }}
              />
              <Button variant="link" className="position-absolute end-0 top-0 h-100 text-dark pe-3" style={{ fontSize: "16px" }}>
                <FaSearch />
              </Button>
            </Form>

            {/* Right icons */}
            <div className="d-flex align-items-center">
              <Button variant="danger" className="rounded-pill px-3 me-4 fw-semibold" style={{ backgroundColor: "#ff7f73", border: "none" }}>
                Find Your Fit
              </Button>

              <div className="d-flex align-items-center gap-5 fs-5 text-dark">
                <div className="d-flex align-items-center gap-5 fs-5 text-dark">
                  <div
                    className="d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={handleProfileClick}
                  >
                    <FaUser size={22} />
                    <Profile ref={profileRef} /> {/* Profile dropdown */}
                    <div className="d-flex flex-column lh-1">
                      <strong style={{ fontSize: "13px" }}>{isLoggedIn ? "My Account" : "Hello guest!"}</strong>
                    </div>
                  </div>
                </div>

                {/* Cart Icon with Count */}
                <div className="position-relative">
                  <FaShoppingCart className="cursor-pointer" onClick={toggleCart} />
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
                <FaHeart />
                <FaBell />
              </div>
            </div>
          </Container>
        </Navbar>

        {/* === Bottom Menu Line === */}
        <div className="border-top border-bottom bg-white w-100 position-relative" style={{ zIndex: 1000 }}>
          <Container fluid className="d-flex flex-wrap justify-content-center align-items-center gap-4 py-2">
            {/* Static menu items: New Arrivals and Explore */}
            <div className="nav-item position-relative">
              <button
                onClick={() => handleMenuClick({ path: "/shop", label: "New Arrivals" })}
                className="bg-transparent border-0 text-decoration-none text-gradient fw-semibold"
                style={{ fontSize: "14px", cursor: "pointer" }}
              >
                New Arrivals
              </button>
            </div>

            <div className="nav-item position-relative">
              <button
                onClick={() => handleMenuClick({ path: "/shop", label: "Explore" })}
                className="bg-transparent border-0 text-decoration-none text-gradient fw-semibold"
                style={{ fontSize: "14px", cursor: "pointer" }}
              >
                Explore
              </button>
            </div>

            {/* Dynamically fetched categories */}
            {loading ? (
              <span>Loading categories...</span>
            ) : (
              menuItems.map((item) => (
                <div key={item.id} className="nav-item position-relative">
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`bg-transparent border-0 text-decoration-none ${item.id === 1 || item.id === 2 ? "text-gradient fw-semibold" : "text-dark"}`}
                    style={{
                      fontSize: "14px",
                      borderLeft: item.id === 1 ? "none" : "1px solid #000",
                      paddingLeft: item.id === 1 ? "0" : "10px",
                      cursor: "pointer",
                    }}
                  >
                    {item.label}
                  </button>

                  {/* Mega Menu logic */}
                  {item.hasMegaMenu && (
                    <div className="mega-menu">
                      <div className="menu-grid">
                        {/* Column 1 */}
                        <div>
                          <h6>BY COLLECTION</h6>
                          <ul>
                            <li>Innovation</li>
                            <li>Bra Tops & Corset <span className="badge-new">NEW</span></li>
                            <li>Bridal Bras <span className="badge-hot">HOT SELLING</span></li>
                            <li>Shimmering Secrets <span className="badge-bridal">BRIDAL</span></li>
                            <li>Forever Yours <span className="badge-bridal">BRIDAL</span></li>
                            <li>Lingerie Sets</li>
                            <li>Miracle Bras</li>
                            <li>Seamless Bra</li>
                            <li>La Flamme <span className="badge-bridal">BRIDAL</span></li>
                            <li>Marshmallow Bra</li>
                            <li>@ Work</li>
                          </ul>
                        </div>

                        {/* Column 2 */}
                        <div>
                          <h6>BY PREFERENCES</h6>
                          <ul>
                            <li>Bra Solutions</li>
                            <li>Padded Bra</li>
                            <li>Non Padded Bra</li>
                            <li>Non Wired Bra</li>
                            <li>Wired Bra</li>
                            <li>Front Open Bra</li>
                            <li>Push Up Bra</li>
                            <li>Full Coverage Bra</li>
                            <li>Medium Coverage Bra</li>
                            <li>Low Coverage Bra</li>
                            <li>Solid Bra</li>
                            <li>Printed Bra</li>
                            <li>Pack of 2 <span className="badge-new">NEW</span></li>
                          </ul>
                        </div>

                        {/* Column 3 */}
                        <div>
                          <h6>BY STYLE</h6>
                          <ul>
                            <li>T-Shirt Bras</li>
                            <li>Curvy / Super Support</li>
                            <li>Strapless Bras</li>
                            <li>Minimiser Bras</li>
                            <li>Backless / Transparent Bras</li>
                            <li>Home Bras <span className="badge-new">NEW</span></li>
                            <li>Slip On Bra / Bralette</li>
                            <li>Lace Bra</li>
                            <li>Maternity Bras</li>
                            <li>No Sag Bra</li>
                            <li>Pretty Back Bras</li>
                            <li>Teens / Beginner Bra</li>
                            <li>OH SO SEXY!</li>
                            <li>Sports Bras</li>
                            <li>Blouze Bra</li>
                            <li>Post Surgical / Mastectomy</li>
                          </ul>
                        </div>

                        {/* Column 4 */}
                        <div>
                          <h6>BY BRANDS</h6>
                          <ul>
                            <li>Zivame</li>
                            <li>Rosaline By Zivame</li>
                            <li>Marks & Spencer</li>
                            <li>Amante</li>
                            <li>Triumph</li>
                          </ul>
                        </div>

                        {/* Column 5 */}
                        <div>
                          <h6>BY OCCASION</h6>
                          <ul>
                            <li>Summer <span className="badge-hot">HOT SELLING</span></li>
                            <li>Everyday</li>
                            <li>Holiday / Vacation</li>
                            <li>Bridal <span className="badge-hot">HOT SELLING</span></li>
                            <li>Party <span className="badge-hot">HOT SELLING</span></li>
                            <li>Luxe</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </Container>
        </div>
      </div>

      {/* === Cart Modal === */}
      <Cart showCart={showCart} toggleCart={toggleCart} />
    </>
  );
};

export default NavBar;
