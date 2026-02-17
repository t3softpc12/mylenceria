import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Register = ({ switchMode, openLogin }) => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [mobile, setMobile] = useState(""); // Store mobile number input
  const [otp, setOtp] = useState(""); // Store OTP input
  const [otpSent, setOtpSent] = useState(false); // Flag for OTP sent state
  const [otpError, setOtpError] = useState(""); // Store OTP error message
  const [isRegistered, setIsRegistered] = useState(false); // Flag for registration status
  const [inputOtp, setInputOtp] = useState("");



  const handleSendOtp = async () => {
      if (otpSent) return; // Prevent multiple clicks

  try {
   const accountname = `${firstname} ${lastname}`;

    const response = await axios.post(
      import.meta.env.VITE_AUTH_API,
      {
        type: "SENTOTP",
        mobileno: mobile,
        purpose: "REGISTER",
        firstname: firstname,
        lastname: lastname,
        accountname: accountname,
      }
    );

    if (response.data.success) {
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error("Error sending OTP.");
  }
};

  const handleOtpVerification = async () => {
    const accountname = `${firstname} ${lastname}`;
    try {
      const response = await axios.post(
        import.meta.env.VITE_AUTH_API,
        {
          type: "VERIFYOTP",
          purpose: "REGISTER",
          firstname: firstname,
          lastname: lastname,
          accountname: accountname,
          mobileno: mobile,
          otp: inputOtp,
        },
      );

       console.log("API Response:", response.data);

      if (response.data.success) {
        const token = response.data.token;
        login(token);
        setIsRegistered(true);
        toast.success("Registration successful! You are now logged in.");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error verifying OTP.");
    }
  };



  return (
    <div style={{ width: "100%", paddingBottom: "30px" }}>
      {/* Registration Box */}

      <div className="my-4">REGISTER</div>

      <div
        className="bg-white rounded-3 shadow-sm p-3"
        style={{ border: "1px solid #f1f1f1" }}
      >
        {!otpSent ? (
          <>
            {/* Input Label */}

            <div className="d-flex gap-1">
              <div>
                <label
                  className="small text-muted mb-1"
                  style={{ fontSize: "12px" }}
                >
                  First Name
                </label>
                <input
                  className="form-control py-2 mb-1"
                  style={{ fontSize: "13px" }}
                  placeholder="Enter first name"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                {/* Last Name */}
                <label
                  className="small text-muted mb-1"
                  style={{ fontSize: "12px" }}
                >
                  Last Name
                </label>
                <input
                  className="form-control py-2 mb-1"
                  style={{ fontSize: "13px" }}
                  placeholder="Enter last name"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <label
              className="small text-muted mb-1"
              style={{ fontSize: "12px" }}
            >
              Mobile Number
            </label>

            {/* Input */}
            <input
              key="mobile-input"
              className="form-control mb-3 py-2"
              style={{ fontSize: "13px" }}
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={10}
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
              onClick={handleSendOtp} // Send OTP
            >
              Continue
            </button>
          </>
        ) : (
          <>
            {/* OTP Input */}
            <label
              className="small text-muted mb-1"
              style={{ fontSize: "12px" }}
            >
              Enter OTP
            </label>

            <input
              className="form-control mb-3 py-2"
              style={{ fontSize: "13px" }}
              placeholder="Enter OTP"
              maxLength={4}
              value={inputOtp}
              onChange={(e) => setInputOtp(e.target.value)}
            />

            {/* OTP Error Message */}
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
              onClick={handleOtpVerification} // Verify OTP
            >
              VERIFY OTP
            </button>

            {/* Resend OTP Button */}
            <div className="text-center my-3" style={{ fontSize: "12px" }}>
              <button
                className="btn btn-link"
                onClick={() => setIsOtpResent(true)} // Handle resend OTP
                style={{ fontSize: "13px", color: "#007bff" }}
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        {/* Divider */}
        {/* <div className="text-center my-3" style={{ fontSize: "12px", color: "#777" }}>
          ———  or  ———
        </div> */}

        {/* Switch between Register/Login */}
        <div className="text-center mt-5" style={{ fontSize: "13px" }}>
          Already have an account?{" "}
          <span
            className="fw-semibold"
            style={{ color: "#ff7f73", cursor: "pointer" }}
            onClick={openLogin}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
