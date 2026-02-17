import React, { useEffect, useState } from "react";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { FaChevronRight } from "react-icons/fa";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProfileSection from '../components/ProfileSections/ProfileSection';
import AddressSection from '../components/ProfileSections/AddressSection';
import DownloadSection from '../components/ProfileSections/DownloadSection';
import OrderSection from '../components/ProfileSections/OrderSection';
import WishlistSection from "../components/ProfileSections/WishlistSection";

// Sidebar Menu
const menuItems = [
  { key: "profile", label: "Profile" },
  { key: "orders", label: "Your Orders" },
  { key: "wishlist", label: "Wishlist" },
  { key: "address", label: "Saved Address" },
  { key: "downloads", label: "Downloadable Products" },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionFromUrl = searchParams.get("section") || "profile";
  const [activeSection, setActiveSection] = useState(sectionFromUrl);

  useEffect(() => {
    if (sectionFromUrl !== activeSection) {
      setActiveSection(sectionFromUrl);
    }
  }, [sectionFromUrl]);

  const updateSection = (sectionKey) => {
    setActiveSection(sectionKey);
    setSearchParams({ section: sectionKey });
  };

  return (
    <Container fluid  className="px-5 mt-4" style={{ minHeight: "100vh" }}>
      <Row>
        {/* Sidebar */}
        <Col md={3} className="mb-4">
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "0",
              boxShadow: "0px 2px 10px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#110d0cff",
                color: "#fff",
                padding: "15px",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              My Account
            </div>

            <ListGroup variant="flush">
              {menuItems.map((item) => {
                const active = activeSection === item.key;

                return (
                  <ListGroup.Item
                    key={item.key}
                    onClick={() => updateSection(item.key)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: active ? "#FFF2F0" : "#fff",
                      color: active ? "#000000ff" : "#5a3939ff",
                      borderBottom: "1px solid #eee",
                      fontWeight: active ? 600 : 500,
                      padding: "12px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {item.label}
                    <FaChevronRight size={12} />
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9}>
          <div
            style={{
              borderRadius: "12px",
              boxShadow: "2px 2px 15px 10px rgba(0,0,0,0.06)",
              border: "none",
            }}
          >
            <div className="px-4 py-3">
              {activeSection === "profile" && <ProfileSection />}
              {activeSection === "address" && <AddressSection />}
              {activeSection === "wishlist" && <WishlistSection />}
              {activeSection === "orders" && <OrderSection />}
              {activeSection === "downloads" && <DownloadSection />}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
