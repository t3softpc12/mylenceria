// src/pages/OrderSuccess.jsx
import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  const handleCheckStatus = () => {
    navigate("/account?section=orders");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light m-0"
    >
      <div
        className="text-center bg-white rounded-4 shadow-lg p-5"
        style={{ maxWidth: "30vw", width: "100%" }}
      >
        {/* Success Check Icon */}
        <div className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
             style={{
               width: "80px",
               height: "80px",
               border: "2px solid #28a745",
             }}>
          <i className="bi bi-check-lg text-success" style={{ fontSize: "40px" }}></i>
        </div>

        {/* Title */}
        <h4 className="text-danger mb-2">Order Successful</h4>
        <p className="text-muted mb-4">Thank you so much for your order.</p>

        {/* Button */}
        <Button
          variant="success"
          size="lg"
          className="px-5 text-white fw-semibold text-uppercase"
          onClick={handleCheckStatus}
        >
          Check Status
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccess;