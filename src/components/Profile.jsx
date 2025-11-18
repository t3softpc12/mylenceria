import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";

const Profile = forwardRef((props, ref) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const popupRef = useRef(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook


  // Expose openPopup and closePopup methods to parent (NavBar)
  useImperativeHandle(ref, () => ({
    openPopup: () => setShowPopup(true),
    closePopup: () => setShowPopup(false),
  }));

  // Load login state from localStorage when component mounts
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus === "true") {
      setIsLoggedIn(true); // Set logged-in state if found in localStorage
    }
  }, []);

  // Handle login success
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true"); // Save login state to localStorage
    setShowLogin(false); // Close login modal after success
    setShowPopup(false); // Close the profile popup immediately after login
  };

    const handleGoToProfile = () => {
    navigate("/account"); // Navigate to the /profile route
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn"); // Remove login state from localStorage
    setShowPopup(false); // Close the popup on logout
  };

  // Close all popups
  const handleCloseAll = () => {
    setShowPopup(false);
    setShowLogin(false);
    setShowRegister(false);
  };

  // Hide popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    // Only attach the event listener if the popup is shown
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);

  // Render Profile Popup or Logged-in dropdown
  return (
    <>
      {/* Profile Popup for Guest */}
      {showPopup && !isLoggedIn && (
        <div
          ref={popupRef}
          className="position-absolute mt-2 p-3 shadow rounded bg-white"
          style={{
            width: "15vw",
            zIndex: 2500,
            right: "50px",
            top: "45px",
          }}
        >
          <h6 className="fw-bold my-2">Welcome Guest</h6>
          <p className="text-muted small my-2">Manage Cart, Orders & Wishlist</p>
          <hr className="my-2" />
          <div className="d-flex justify-content-between gap-2">
            <Button
              variant="dark"
              className="w-100 px-3 py-1"
              onClick={() => {
                setShowLogin(true);
                setShowPopup(false); // Close the profile popup immediately
              }}
            >
              Sign In
            </Button>
            <Button
              variant="outline-dark"
              className="w-100 px-3 py-1"
              onClick={() => {
                setShowRegister(true);
                setShowPopup(false); // Close the profile popup immediately
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}

      {/* Dropdown for Logged-in User */}
      {isLoggedIn && (
        <div
          ref={popupRef}
          className="position-absolute mt-2 p-3 shadow rounded bg-white"
          style={{
            width: "15vw",
            zIndex: 2500,
            right: "50px",
            top: "45px",
          }}
        >
          <h6 className="fw-bold my-2">Welcome Back!</h6>
          <p className="text-muted small my-2">Manage your account and orders</p>
          <hr className="my-2" />
          <div className="d-flex flex-column gap-2">
            <Button variant="link" className="text-dark" onClick={handleGoToProfile}>
              Orders
            </Button>
            <Button variant="link" className="text-dark" onClick={handleGoToProfile}>
              Account
            </Button>
            <Button variant="link" className="text-dark" onClick={handleGoToProfile}>
              Wishlist
            </Button>
            <Button variant="link" className="text-dark" onClick={handleGoToProfile}>
              Address
            </Button>
            <Button
              variant="link"
              className="text-danger"
              onClick={handleLogout} // Handle logout functionality
            >
              Log Out
            </Button>
          </div>
        </div>
      )}

      {/* Separate Modals */}
      <Login show={showLogin} handleClose={handleCloseAll} handleLoginSuccess={handleLoginSuccess} />
      <Register show={showRegister} handleClose={handleCloseAll} />
    </>
  );
});

export default Profile;
