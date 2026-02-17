// src/components/AuthModal.jsx
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AuthModal = forwardRef(({ onSuccess }, ref) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [mobile, setMobile] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
    const { login } = useAuth();

  // Expose openPopup to ref
  useImperativeHandle(ref, () => ({
    openPopup: () => setShow(true),
    closePopup: () => setShow(false),
  }));

  const handleClose = () => {
    setShow(false);
    // Reset form on close (optional)
    setMobile('');
    setFirstName('');
    setLastName('');
    setOtp('');
    setOtpSent(false);
  };

  const handleSendOtp = async () => {
    const cleanMobile = mobile.trim();
    if (!/^\d{10}$/.test(cleanMobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        type: "SENTOTP",
        purpose: mode.toUpperCase(), // LOGIN or REGISTER
        mobileno: cleanMobile,
      };

      // Add name fields ONLY for register
      if (mode === 'register') {
        if (!firstName.trim() || !lastName.trim()) {
          toast.error("Please enter first and last name");
          setLoading(false);
          return;
        }
        payload.firstname = firstName.trim();
        payload.lastname = lastName.trim();
        payload.accountname = `${firstName.trim()} ${lastName.trim()}`; // or custom logic
      }

      const res = await axios.post(import.meta.env.VITE_AUTH_API, payload);

      if (res.data.success) {
        toast.success("OTP sent successfully!");
        setOtpSent(true);
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanOtp = otp.trim();
    if (!/^\d{4,6}$/.test(cleanOtp)) {
      toast.error("Please enter a valid OTP");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        type: "VERIFYOTP",
        purpose: mode.toUpperCase(),
        mobileno: mobile.trim(),
        otp: cleanOtp,
      };

      // For register, send names again (backend might need them)
      if (mode === 'register') {
        payload.firstname = firstName.trim();
        payload.lastname = lastName.trim();
        payload.accountname = `${firstName.trim()} ${lastName.trim()}`;
      }

      const res = await axios.post(import.meta.env.VITE_AUTH_API, payload);

      if (res.data.success) {
        const token = res.data.token;
        login(token); 
        toast.success(mode === 'login' ? "Logged in successfully!" : "Registered & logged in!");
        
        onSuccess?.();
        handleClose();
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Verification failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      dialogClassName="auth-modal-lg"
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="w-100 text-center fw-bold">
          {mode === 'login' ? 'LOG IN TO YOUR ACCOUNT' : 'SIGN UP'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-5 position-relative">
        {/* Floating switcher circle */}



        <div
          className="position-absolute top-0 end-0 mt-4 me-4 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-lg"
          style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
            fontSize: '16px',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.3s',
          }}
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'SIGN UP' : 'LOG IN'}
        </div>

        <Form>

                      {/* First & Last Name - only in SIGN UP mode, before OTP */}
          {mode === 'register' && !otpSent && (
            <div className="row mb-4">
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="fw-medium">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="fw-medium">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                  />
                </Form.Group>
              </div>
            </div>
          )}
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Mobile Number</Form.Label>
            <InputGroup>
              <InputGroup.Text>+91</InputGroup.Text>
              <Form.Control
                type="tel"
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                disabled={otpSent || loading}
              />
            </InputGroup>
          </Form.Group>



          {/* OTP - shown after sending */}
          {otpSent && (
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">OTP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter 4-digit OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
              />
            </Form.Group>
          )}

          {mode === 'login' && !otpSent && (
            <Form.Check
              type="checkbox"
              label="Remember me"
              className="mb-4"
            />
          )}

          {!otpSent ? (
            <Button
              variant="danger"
              size="lg"
              className="w-100 mb-3 fw-bold"
              onClick={handleSendOtp}
              disabled={loading || mobile.length !== 10 || (mode === 'register' && (!firstName.trim() || !lastName.trim()))}
            >
              {loading ? 'Sending...' : 'Continue'}
            </Button>
          ) : (
            <Button
              variant="danger"
              size="lg"
              className="w-100 mb-3 fw-bold"
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 4}
            >
              {loading ? 'Verifying...' : `VERIFY OTP & ${mode.toUpperCase()}`}
            </Button>
          )}
        </Form>

        {/* Forgot password link - only in LOGIN */}
        {/* {mode === 'login' && (
          <div className="text-center mt-3">
            <a href="#" className="text-danger text-decoration-none small">
              Forgot password?
            </a>
          </div>
        )} */}
      </Modal.Body>
    </Modal>
  );
});

export default AuthModal;