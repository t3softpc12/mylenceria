import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ValidateUser from "./ValidateUser";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Login = ({ mode, switchMode, openRegister, handleCloseDrawer }) => {
  const { login } = useAuth();
  const {initializeCartAfterLogin} = useCart();
  const [mobile, setMobile] = useState("");     // store mobile number
  const [inputValue, setInputValue] = useState(""); // for OTP input
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otp, setOtp] = useState("");           // store OTP received


const handleSendOtp = async () => {
  try {
    const response = await axios.post(import.meta.env.VITE_AUTH_API, {
      type: "SENTOTP",
      mobileno: mobile,
      purpose: "LOGIN"
    });

    if (response.data.success) {
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } else {
      toast.error(response.data.message);
    }
  } catch (err) {
    toast.error("Failed to send OTP");
  }
};


const handleOtpVerification = async () => {
  try {
    const response = await axios.post(import.meta.env.VITE_AUTH_API, {
      type: "VERIFYOTP",
      mobileno: mobile,
      otp: inputValue,
      purpose: "LOGIN"
    });

    const { initializeCartAfterLogin } = useCart();

    if (response.data.success) {
      const token = response.data.token;

      login(token); // ✅ only token
      toast.success("Login successful!");

        await initializeCartAfterLogin();

      handleCloseDrawer();

    } else {
      toast.error(response.data.message);
    }
  } catch (err) {
    toast.error("OTP verification failed");
  }
};


  return (
    <div style={{ width: "100%", paddingBottom: "30px" }}>
      {/* Back Button */}
      <div className="d-flex align-items-center gap-2 mb-5">
        <h6 className="fw-bold m-0" style={{ fontSize: "15px" }}>
          {mode === "mobile" ? "Login with Mobile" : "Login with Email"}
        </h6>
      </div>

      {/* Login Box */}
      <div className="bg-white rounded-3 shadow-sm p-3" style={{ border: "1px solid #f1f1f1" }}>
        {!otpSent ? (
          <>
            {/* Input Label */}
            <label className="small text-muted mb-1" style={{ fontSize: "12px" }}>
              {mode === "mobile" ? "Phone Number" : "Email ID"}
            </label>

            {/* Mobile Input */}
            <input
              className="form-control mb-3 py-2"
              style={{ fontSize: "13px" }}
              placeholder={
                mode === "mobile" ? "Enter mobile number" : "Enter email ID"
              }
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            {/* Continue Button */}
            <button
              className="btn w-100 py-2 rounded-3"
              style={{
                backgroundColor: "#ff7f73",
                border: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
              onClick={() => handleSendOtp(mobile)}
            >
              Continue
            </button>
          </>
        ) : (
          <>
            {/* OTP Input */}
            <label className="small text-muted mb-1" style={{ fontSize: "12px" }}>
              Enter OTP
            </label>

            <input
              className="form-control mb-3 py-2"
              style={{ fontSize: "13px" }}
              placeholder="Enter OTP"
              maxLength={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            {/* OTP Error */}
            {otpError && (
              <p style={{ color: "red", fontSize: "12px" }}>{otpError}</p>
            )}

            {/* Verify Button */}
            <button
              className="btn w-100 py-2 rounded-3"
              style={{
                backgroundColor: "#ff7f73",
                border: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
              onClick={handleOtpVerification} // Validate OTP
            >
              VERIFY OTP
            </button>

            {/* Resend OTP Button */}
            <div className="text-center my-3" style={{ fontSize: "12px" }}>
              <button
                className="btn btn-link"
                onClick={() => handleSendOtp(mobile)}
                style={{ fontSize: "13px", color: "#007bff" }}
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        {/* Divider */}
        <div className="text-center my-3" style={{ fontSize: "12px", color: "#777" }}>
          ———  or  ———
        </div>

        {/* Switch between Mobile / Email */}
        <button
          className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 border"
          style={{
            background: "#fafafa",
            border: "1px solid #ddd",
            fontSize: "13px",
          }}
          onClick={switchMode}
        >
          {mode === "mobile"
            ? "Login using email"
            : "Login using mobile number"}
        </button>
      </div>

      {/* Register Section */}
      <div className="text-center mt-4">
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
          🎁 Register now to get <strong>₹150 Off</strong> + Free Shipping
        </p>
      </div>
    </div>
  );
};

export default Login;
