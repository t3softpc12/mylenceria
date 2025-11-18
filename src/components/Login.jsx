import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const Login = ({ show, handleClose, handleLoginSuccess }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp] = useState("9999"); // Default OTP for demo purposes

  const handleSendOtp = () => {
    alert(`OTP Sent: ${generatedOtp}`); // OTP is hardcoded as 9999 for demo
    setIsOtpSent(true); // Mark OTP as sent
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      handleLoginSuccess(); // Successfully logged in
      handleClose(); // Close the modal
    } else {
      alert("Invalid OTP, please try again.");
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="border-0 shadow-lg rounded-4"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-4 text-center w-100">
          Welcome Back !
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <p className="text-center text-muted mb-4">
          Log in using your mobile number
        </p>
        <Form>
          {/* Mobile Number */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small text-muted">
              Mobile Number
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="py-2 rounded-3 border border-light shadow-sm"
            />
          </Form.Group>

          {/* OTP Input */}
          {isOtpSent && (
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold small text-muted">
                Enter OTP
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="py-2 rounded-3 border border-light shadow-sm"
              />
            </Form.Group>
          )}

          {/* Buttons */}
          {!isOtpSent ? (
            <Button
              variant="dark"
              className="w-100 py-2 rounded-pill fw-semibold"
              style={{ backgroundColor: "#232c85", border: "none" }}
              onClick={handleSendOtp}
            >
              Send OTP
            </Button>
          ) : (
            <Button
              variant="dark"
              className="w-100 py-2 rounded-pill fw-semibold"
              style={{ backgroundColor: "#232c85", border: "none" }}
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </Button>
          )}

          {/* Sign Up Link */}
          <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: "13px" }}>
            Don’t have an account?{" "}
            <span className="text-primary fw-semibold" style={{ cursor: "pointer" }}>
              Sign Up
            </span>
          </p>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Login;
