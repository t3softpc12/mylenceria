import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaTruck, FaExchangeAlt, FaHeadphones, FaLock } from "react-icons/fa";

  const features = [
    {
      icon: <FaTruck size={30} color="#061738ff" />,
      title: "Free Shipping",
      desc: "Enjoy free shipping on all orders",
    },
    {
      icon: <FaExchangeAlt size={30} color="#061738ff" />,
      title: "Product Replace",
      desc: "Easy Product Replacement Available!",
    },
    {
    icon: <FaLock size={30} color="#061738ff" />,
    title: "Secure Payments",
    desc: "Your payments are 100% safe and protected",
     },
    {
      icon: <FaHeadphones size={30} color="#061738ff" />,
      title: "24/7 Support",
      desc: "Dedicated 24/7 support via chat and email",
    },
  ];

const Footer = () => {
  return (
    <>

      <div style={{ background: "#fff", borderBottom: "1px solid #eee" }}>
      <Container className="py-5">
        <Row className="text-center text-md-start justify-content-center">
          {features.map((f, index) => (
            <Col key={index} xs={6} md={3} className="d-flex align-items-start mb-4 mb-md-0">
              <div
                style={{
                  border: "1px solid #000",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "15px",
                }}
              >
                {f.icon}
              </div>
              <div>
                <h6 className="fw-bold mb-1">{f.title}</h6>
                <p className="text-muted mb-0" style={{ fontSize: "15px" }}>
                  {f.desc}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>

    <footer className="" style={{ background: "#e9e7deb2", color: "#222", fontSize: "12px" }}>
      <Container className="py-5">
        <Row className="gy-4">
          {/* CUSTOMER SERVICE */}
          <Col xs={12} md={3}>
            <h6 className="fw-semibold text-uppercase" style={{ fontSize: "14px" }}>
              Customer Service
            </h6>
            <ul className="list-unstyled mb-2">
              <li>Privacy Policy</li>
              <li>Shipping / Delivery</li>
              <li>Returns & Exchange</li>
              <li>Raise a Return / Exchange Request</li>
              <li>Size Guide</li>
              <li>Contact Us</li>
              <li>customercare@mylenceria.com</li>
              <li>Mon–Sat: 9.00 AM – 6.00 PM (IST)</li>
              <li>+91 1496566771</li>
              <li>FAQs</li>
              <li>Rewards</li>
              <li>Refer & Earn</li>
            </ul>
          </Col>

          {/* ACCOUNT */}
          <Col xs={12} md={3}>
            <h6 className="fw-semibold mb-3 text-uppercase" style={{ fontSize: "14px" }}>
              Account
            </h6>
            <ul className="list-unstyled mb-0">
              <li>Terms & Conditions</li>
              <li>Track Order</li>
              <li>Wishlist</li>
              <li>Cart</li>
            </ul>
          </Col>

          {/* BRAND */}
          <Col xs={12} md={3}>
            <h6 className="fw-semibold mb-3 text-uppercase" style={{ fontSize: "14px" }}>
              Brand
            </h6>
            <ul className="list-unstyled mb-0">
              <li>The MY Lenceria Story</li>
              <li>Our Founders</li>
            </ul>
          </Col>

          {/* FIND US */}
          <Col xs={12} md={3}>
            <h6 className="fw-semibold mb-3 text-uppercase" style={{ fontSize: "14px" }}>
              Find Us
            </h6>
            <ul className="list-unstyled mb-0">
              <li><a href="#" className="text-decoration-none text-dark">Instagram</a></li>
              <li><a href="#" className="text-decoration-none text-dark">YouTube</a></li>
              <li><a href="#" className="text-decoration-none text-dark">WhatsApp</a></li>
              <li><a href="#" className="text-decoration-none text-dark">LinkedIn</a></li>
            </ul>
          </Col>
        </Row>
      </Container>

      <div
        style={{
          background: "#e9e6dbb2",
          fontSize: "13px",
          textAlign: "center",
          padding: "15px 0",
          color: "#555",
          borderTop: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        © Copyright 2025 – 2026, <strong>MY Lenceria</strong>. All rights reserved.
      </div>
    </footer>
    </>
  );
};

export default Footer;
