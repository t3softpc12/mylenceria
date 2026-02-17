import React, { useState, useEffect } from "react";
import {Button, Alert, Form, Spinner, Modal, Row, Col } from "react-bootstrap";
import { FaEdit, FaCheck, FaTimes, FaEnvelope, FaPhone, FaBirthdayCake } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const ProfileSection = () => {
  const { user } = useAuth();
  const accountid = user.accountid;

  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    dateofbirth: "",
  });

  const [editingField, setEditingField] = useState(null); // 'name', 'dateofbirth', etc.
  const [tempValue, setTempValue] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // OTP Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpFieldType, setOtpFieldType] = useState("");
  const [newOtpValue, setNewOtpValue] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0); // countdown in seconds
const [resendDisabled, setResendDisabled] = useState(false);

  useEffect(() => {
    if (!accountid) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(import.meta.env.VITE_PROFILE_SECTION, {
          params: { accountid },
        });

        if (res.data.success) {
          setProfile(res.data.user);
        }
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accountid]);

  const startEdit = (field) => {
    setEditingField(field);
    if (field === "name") {
      setTempValue({
        firstname: profile.firstname || "",
        lastname: profile.lastname || "",
      });
    } else {
      setTempValue({ [field]: profile[field] || "" });
    }
    setError("");
    setSuccess("");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue({});
  };

  const saveName = async () => {
    const { firstname, lastname } = tempValue;
    if (
      firstname.trim() === profile.firstname &&
      lastname.trim() === profile.lastname
    ) {
      cancelEdit();
      return;
    }

    if (!firstname.trim() || !lastname.trim()) {
      setError("Both first and last name are required");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.put(
        import.meta.env.VITE_PROFILE_SECTION,
        { firstname: firstname.trim(), lastname: lastname.trim() },
        { params: { accountid } }
      );

      if (res.data.success) {
        setProfile((prev) => ({
          ...prev,
          firstname: firstname.trim(),
          lastname: lastname.trim(),
        }));
        setSuccess("Name updated successfully!");
        cancelEdit();
      }
    } catch (err) {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveSimpleField = async (field) => {
    const value = tempValue[field]?.trim();
    if (value === profile[field]) {
      cancelEdit();
      return;
    }

    setSaving(true);
    try {
      const res = await axios.put(
        import.meta.env.VITE_PROFILE_SECTION,
        { [field]: value },
        { params: { accountid } }
      );

      if (res.data.success) {
        setProfile((prev) => ({ ...prev, [field]: value }));
        setSuccess(`${field === "dateofbirth" ? "Birthdate" : field} updated successfully!`);
        cancelEdit();
      }
    } catch (err) {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const openOtpFlow = (field) => {
    setOtpFieldType(field);
    setNewOtpValue("");
    setOtp("");
    setOtpSent(false);
    setShowOtpModal(true);
  };

const sendOtp = async () => {
  if (!newOtpValue.trim()) {
    setError("Please enter a valid value");
    return;
  }

  setOtpLoading(true);
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_PROFILE_SECTION}?action=send_otp&accountid=${accountid}`,
      {
        type: otpFieldType,
        value: newOtpValue.trim(),
      }
    );

    if (res.data.success) {
      console.log("OTP (for testing):", res.data.otp); // 🔥 HERE
      setOtpSent(true);
      setSuccess(`OTP sent to your new ${otpFieldType}!`);
      setError("");
    }
  } catch (err) {
    setError("Failed to send OTP. Try again.");
  } finally {
    setOtpLoading(false);
  }
};


  const verifyAndUpdate = async () => {
    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_PROFILE_SECTION}?action=verify_otp&accountid=${accountid}`,
        {
          type: otpFieldType,
          value: newOtpValue.trim(),
          otp,
        }
      );

      setProfile((prev) => ({ ...prev, [otpFieldType]: newOtpValue.trim() }));
      setSuccess(`${otpFieldType.charAt(0).toUpperCase() + otpFieldType.slice(1)} updated successfully!`);
      setShowOtpModal(false);
    } catch (err) {
      setError("Invalid or expired OTP");
    }
  };

  const fullName = `${profile.firstname} ${profile.lastname}`.trim() || "User";


    const handleOtpChange = (value, index) => {
      if (!/^\d?$/.test(value)) return;
      const newOtp = otp.split("");
      newOtp[index] = value;
      setOtp(newOtp.join(""));

      // Auto-focus next
      if (value && index < 3) {
        document.getElementsByTagName("input")[index + 1].focus();
      }
    };

    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        document.getElementsByTagName("input")[index - 1].focus();
      }
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
      if (paste.length === 4) {
        setOtp(paste);
      }
    };

    // For resend timer (example)
    useEffect(() => {
      if (otpSent && resendTimer > 0) {
        const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [resendTimer, otpSent]);


  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="pink" />
        <p className="mt-3 text-muted">Loading your profile...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container py-4">
        {/* <h2 className="mb-4 fw-bold text-dark">My Profile</h2> */}

        {success && (
          <Alert variant="warning" dismissible onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <div className="bg-white rounded-4 shadow-sm border">
          <div className="p-4 pb-3 border-bottom">
            <h4 className="mb-0 text-pink">Hello, {fullName}!</h4>
            <small className="text-muted">Update your personal information below</small>
          </div>

          <div className="p-4 pt-3">
            {/* Full Name - Combined Edit */}
<div className="py-3 px-2 rounded-4 hover-bg position-relative" 
     style={{ 
       transition: "all 0.3s ease", 
       background: editingField === "name" ? "#fff5f5" : "transparent",
       borderRadius: "20px"
     }}>
  
  {/* Everything in One Line */}
  <div className="d-flex align-items-center justify-content-between gap-4">
    
    {/* Left: Avatar + Full Name */}
    <div className="d-flex align-items-center gap-4 flex-grow-1">
      {/* Avatar with Initials */}
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-2xl flex-shrink-0"
        style={{
          width: "90px",
          height: "90px",
          fontSize: "2.2rem",
          background: "linear-gradient(135deg, #ff6f61, #ff9a93)",
          boxShadow: "0 10px 30px rgba(255, 111, 97, 0.4)",
          letterSpacing: "2px"
        }}
      >
        {profile.firstname?.charAt(0).toUpperCase() || "?"}
        {profile.lastname?.charAt(0).toUpperCase() || ""}
      </div>

      {/* Full Name Text */}
      <div>
        <h2 className="mb-0 fw-bold text-dark" style={{ fontSize: "2rem" }}>
          {profile.firstname || "First Name"} {profile.lastname || "Last Name"}
        </h2>
        {(!profile.firstname && !profile.lastname) && (
          <p className="text-muted mb-0 mt-1">Click Edit to set your name</p>
        )}
      </div>
    </div>

    {/* Right: Action Buttons */}
    <div className="flex-shrink-0">
      {editingField === "name" ? (
        <div className="d-flex gap-3">
          {/* Save Button */}
          <div 
            className={`d-flex align-items-center gap-2 px-4 py-2 rounded-pill border cursor-pointer transition-all ${saving ? 'opacity-60' : 'hover-shadow'}`}
            style={{ 
              backgroundColor: "#fce8e8", 
              borderColor: "#420605ff",
              boxShadow: saving ? "none" : "0 4px 15px rgba(175, 76, 92, 0.15)"
            }}
            onClick={saving ? null : saveName}
          >
            <FaCheck className="text-pink fs-5" />
            <span className="fw-semibold text-pink">Save</span>
          </div>

          {/* Cancel Button */}
          <div 
            className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill border cursor-pointer hover-shadow"
            style={{ 
              backgroundColor: "#fce8e8", 
              borderColor: "#ef5350",
              boxShadow: "0 4px 15px rgba(239, 83, 80, 0.15)"
            }}
            onClick={cancelEdit}
          >
            <FaTimes className="text-danger fs-5" />
            <span className="fw-semibold text-danger">Cancel</span>
          </div>
        </div>
      ) : (
        /* Edit Button */
        <div 
          className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill bg-gradient-pink text-white cursor-pointer shadow-lg hover-lift"
          onClick={() => startEdit("name")}
          style={{ 
            background: "linear-gradient(135deg, #ff6f61, #ff8780)",
            boxShadow: "0 8px 25px rgba(255, 111, 97, 0.3)",
            transition: "all 0.3s ease"
          }}
        >
          <FaEdit className="fs-5" />
          <span className="fw-semibold">Edit Name</span>
        </div>
      )}
    </div>
  </div>

  {/* Edit Mode - Inputs Below (Full Width) */}
  {editingField === "name" && (
    <div className="mt-5">
      <Row className="g-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="First Name"
            value={tempValue.firstname || ""}
            onChange={(e) => setTempValue({ ...tempValue, firstname: e.target.value })}
            className="py-3 fs-5 rounded-3 shadow-sm"
            style={{ 
              border: "2px solid #ff6f61",
              fontWeight: "500"
            }}
            autoFocus
          />
        </Col>
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Last Name"
            value={tempValue.lastname || ""}
            onChange={(e) => setTempValue({ ...tempValue, lastname: e.target.value })}
            className="py-3 fs-5 rounded-3 shadow-sm"
            style={{ 
              border: "2px solid #ff6f61",
              fontWeight: "500"
            }}
          />
        </Col>
      </Row>
    </div>
  )}
</div>

            {/* Birthdate */}
            <div className="d-flex align-items-center justify-content-between py-3 px-2 rounded-3 hover-bg">
              <div className="d-flex align-items-center gap-3">
                <div className="text-pink fs-5"><FaBirthdayCake /></div>
                <div>
                  <div className="fw-semibold">Birthdate</div>
                  <div className="text-muted">
                    {profile.dateofbirth
                      ? new Date(profile.dateofbirth).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not set"}
                  </div>
                </div>
              </div>
              {editingField === "dateofbirth" ? (
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    type="date"
                    size="sm"
                    value={tempValue.dateofbirth}
                    onChange={(e) => setTempValue({ dateofbirth: e.target.value })}
                  />
                  <FaCheck className="text-success fs-5 cursor-pointer" onClick={() => saveSimpleField("dateofbirth")} />
                  <FaTimes className="text-danger fs-5 cursor-pointer" onClick={cancelEdit} />
                </div>
              ) : (
                <FaEdit className="text-pink fs-4 cursor-pointer opacity-75 hover-opacity" onClick={() => startEdit("dateofbirth")} />
              )}
            </div>

            {/* Email */}
            <div className="d-flex align-items-center justify-content-between py-3 px-2 rounded-3 hover-bg">
              <div className="d-flex align-items-center gap-3">
                <div className="text-pink fs-5"><FaEnvelope /></div>
                <div>
                  <div className="fw-semibold">Email</div>
                  <div className="text-muted">{profile.email || "Not set"}</div>
                </div>
              </div>
              <FaEdit
                className="text-pink fs-4 cursor-pointer opacity-75 hover-opacity"
                onClick={() => openOtpFlow("email")}
                title="Change email (OTP required)"
              />
            </div>

            {/* mobile */}
            <div className="d-flex align-items-center justify-content-between py-3 px-2 rounded-3 hover-bg">
              <div className="d-flex align-items-center gap-3">
                <div className="text-pink fs-5"><FaPhone /></div>
                <div>
                  <div className="fw-semibold">mobile Number</div>
                  <div className="text-muted">{profile.mobile || "Not set"}</div>
                </div>
              </div>
              <FaEdit
                className="text-pink fs-4 cursor-pointer opacity-75 hover-opacity"
                onClick={() => openOtpFlow("mobile")}
                title="Change mobile (OTP required)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
<Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
  <Modal.Header closeButton className="border-0 pb-2">
    <Modal.Title className="fs-5 w-100 text-center">
      Update {otpFieldType === "email" ? "Email Address" : "Mobile Number"}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body className="px-4 pt-3 pb-4">
    {!otpSent ? (
      <>
        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">New {otpFieldType === "email" ? "Email" : "Mobile Number"}</Form.Label>
          <Form.Control
            type={otpFieldType === "email" ? "email" : "tel"}
            value={newOtpValue}
            onChange={(e) => setNewOtpValue(e.target.value)}
            placeholder={otpFieldType === "email" ? "Enter your email" : "Enter your mobile number"}
            autoFocus
            className="py-3"
            isInvalid={!!error} // optional: add error state
          />
          {/* <Form.Text className="text-danger">{error}</Form.Text> */}
        </Form.Group>
        <Button
          variant="pink"
          size="lg"
          className="w-100 fw-semibold"
          onClick={sendOtp}
          disabled={otpLoading || !newOtpValue.trim()}
        >
          {otpLoading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </>
    ) : (
      <>
        <div className="text-center mb-4">
          <div className="text-success fs-5 mb-2">✓</div>
          <p className="text-muted mb-1 fw-medium">OTP sent to</p>
          <p className="fw-bold">{newOtpValue}</p>
          <small className="text-muted">Enter the 4-digit code</small>
        </div>

        {/* Separate OTP Boxes */}
        <div className="d-flex justify-content-center gap-2 mb-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Form.Control
              key={i}
              type="text"
              maxLength={1}
              value={otp[i] || ""}
              onChange={(e) => handleOtpChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="text-center fs-3 fw-bold"
              style={{
                width: "50px",
                height: "60px",
                borderRadius: "12px",
                border: "2px solid #ddd",
              }}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {/* Optional: Error message */}
        {/* {error && <div className="text-danger text-center mb-3">{error}</div>} */}

        {/* Resend link with countdown */}
        <div className="text-center mb-4">
          <small className="text-muted">
            Didn't receive?{" "}
            {/* <a href="#" onClick={resendOtp} className={resendDisabled ? "text-muted" : "text-pink fw-medium"}>
              Resend OTP {resendTimer > 0 && `in ${resendTimer}s`}
            </a> */}
          </small>
        </div>

        <Button
          variant="pink"
          size="lg"
          className="w-100 fw-semibold"
          onClick={verifyAndUpdate}
          disabled={otp.length < 4}
        >
          Verify & Update
        </Button>
      </>
    )}
  </Modal.Body>
</Modal>

      <style jsx>{`
        .hover-bg:hover {
          background-color: #f8f9fa !important;
        }
        .hover-opacity:hover {
          opacity: 1 !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default ProfileSection;