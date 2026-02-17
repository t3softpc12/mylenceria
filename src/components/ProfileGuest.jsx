import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import { FaPhoneAlt, FaEnvelope, FaGift   } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import Login from "./Login"; // Import Login component for both mobile and email login
import Register from "./Register"; // Import Register component

const ProfileGuest = () => {
  const [view, setView] = useState("guest"); // Track the current view (guest, mobile login, or email login)
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); 
  };

  const handleLogin = (mode) => {
    setView(mode); 
  };

    const switchMode = () => {
    setView((prevView) => (prevView === "mobile" ? "email" : "mobile"));
  };
  
  // Switch to Register view
    const openRegister = () => {
    setView("register");
  };

  // Switch to Login view
  const openLogin = () => {
    setView("guest");
  };

  return (
    <div style={{ width: "100%", paddingBottom: "40px" }} className="my-5">
      {/* Back Button + Header */}
     


      {/* Conditional Rendering */}
      {view === "guest" && (
        <div>

             <div className="d-flex fs-5 align-items-center my-5">
        LOGIN/SIGN UP 
      </div>
          {/* Login Options (Mobile or Email) */}
          <div
            className="bg-white rounded-3 shadow-sm p-4"
            style={{ border: "1px solid #f1f1f1" }}
          >
            {/* Title */}
            <div
              className="text-center fw-semibold mb-3"
              style={{ fontSize: "14px", color: "#555" }}
            >
              Continue with
            </div>

            {/* Mobile Login */}
            <button
              className="w-100 d-flex align-items-center justify-content-center gap-4 py-2 rounded-3 border mb-2"
              style={{
                background: "#fafafa",
                border: "1px solid #ddd",
                fontSize: "13px",
              }}
              onClick={() => handleLogin("mobile")}
            >
              <FaPhoneAlt size={14} /> Login using mobile number
            </button>

            {/* Email Login */}
            <button
              className="w-100 d-flex align-items-center justify-content-center gap-4 py-2 rounded-3 border"
              style={{
                background: "#fafafa",
                border: "1px solid #ddd",
                fontSize: "13px",
              }}
              onClick={() => handleLogin("email")}
            >
              <FaEnvelope size={14} /> Login using email
            </button>
          </div>

          {/* Register Section */}
          <div className="text-center mt-5">
            <p style={{ fontSize: "13px", marginBottom: "6px" }}>
              Don’t have an account?{" "}
              <span
                className="fw-semibold"
                style={{ color: "#ff7f73", cursor: "pointer" }}
                onClick={openRegister}
              >
                Register
              </span>
            </p>

            <p className="text-muted small mt-2" style={{ fontSize: "12px" }}>
              <FaGift className="me-2" color="#ff7f73" />
              Register now to get <strong>₹150 Off</strong> + Free Shipping
            </p>
          </div>
        </div>
      )}

      {/* Mobile or Email Login */}
          {(view === "mobile" || view === "email") && (
            <Login
              mode={view}
              switchMode={switchMode}
              openRegister={openRegister}
              handleCloseDrawer={() => {}}
            />
          )}

          {view === "register" && (
            <Register
              openLogin={openLogin}
              handleCloseDrawer={() => {}}
            />
          )}
    </div>
  );
};

export default ProfileGuest;
