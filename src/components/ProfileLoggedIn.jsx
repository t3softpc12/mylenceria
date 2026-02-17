// src/components/ProfileLoggedIn.jsx
import React from "react";
import {
  FaUserCircle,
  FaShoppingBag,
  FaUser,
  FaHeart,
  FaMapMarkerAlt,
  FaDownload,
  FaSignOutAlt,
  FaChevronRight
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileLoggedIn = ({ handleCloseDrawer }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuth();
  const user_name = user?.accountname;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goToSection = (section) => {
    handleCloseDrawer();
    navigate(`/account?section=${section}`);
  };

  return (
    <div className="px-1">

      {/* User Box */}
      <div
        className="d-flex align-items-center shadow-sm rounded-4 p-3 mb-3"
        style={{ background: "#ffffff" }}
      >
        <FaUserCircle size={60} className="me-3 text-dark" />
        <div>
          <h6 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>{user_name}</h6>
          <small className="text-muted">Welcome Back!</small>
        </div>
      </div>

      {/* Options */}
      <div
        className="rounded-4"
        style={{
          background: "#ffffff",
          overflow: "hidden",
          border: "1px solid #f1f1f1"
        }}
      >
        <MenuItem icon={<FaShoppingBag />} label="Orders" onClick={() => goToSection("orders")} />
        <Divider />

        <MenuItem icon={<FaUser />} label="Profile" onClick={() => goToSection("profile")} />
        <Divider />

        <MenuItem icon={<FaHeart />} label="Wishlist" onClick={() => goToSection("wishlist")} />
        <Divider />

        <MenuItem icon={<FaMapMarkerAlt />} label="Address" onClick={() => goToSection("address")} />
        <Divider />

        <MenuItem icon={<FaDownload />} label="Downloadable Products" onClick={() => goToSection("downloads")} />
        <Divider />

        <MenuItem
          icon={<FaSignOutAlt />}
          label="Logout"
          textColor="red"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

// Helper Item
const MenuItem = ({ icon, label, textColor, onClick }) => (
  <div
    onClick={onClick}
    className="d-flex justify-content-between align-items-center px-3 py-3"
    style={{
      cursor: "pointer",
      color: textColor || "#333",
      fontSize: "1rem",
      transition: "0.2s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#fff2f5ff")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    <span className="d-flex align-items-center gap-3" style={{ fontSize: "1rem" }}>
      <span style={{ fontSize: "1.1rem" }}>{icon}</span> {label}
    </span>
    <FaChevronRight size={16} className="text-muted" />
  </div>
);

// Divider line
const Divider = () => (
  <div style={{ height: "1px", background: "#eee", margin: "0 12px" }}></div>
);

export default ProfileLoggedIn;
