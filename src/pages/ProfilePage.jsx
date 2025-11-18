import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const ProfilePage = () => {
  const navigate = useNavigate();

  // States for profile details
  const [userDetails, setUserDetails] = useState({
    name: "Jimmy",
    email: "john@example.com",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate password fields
    if (userDetails.password !== userDetails.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Simulate API call to update user details
    setTimeout(() => {
      localStorage.setItem("userDetails", JSON.stringify(userDetails)); // Save updated details in localStorage
      setSuccessMessage("Profile updated successfully.");
      setError(""); // Clear any previous errors
    }, 1000);
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={3} className="d-none d-md-block">
          {/* Sidebar Navigation */}
          <div className="list-group">
            <div className="list-group-item bg-dark text-white">My Account</div>
            <a href="/profile" className="list-group-item list-group-item-action">
              Profile
            </a>
            <a href="/address" className="list-group-item list-group-item-action">
              Address
            </a>
            <a href="/orders" className="list-group-item list-group-item-action">
              Orders
            </a>
            <a href="/downloads" className="list-group-item list-group-item-action">
              Downloadable Products
            </a>
          </div>
        </Col>

        <Col md={9}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Profile</h2>

              {/* Success Message */}
              {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
                  {successMessage}
                </Alert>
              )}

              {/* Error Message */}
              {error && (
                <Alert variant="danger" onClose={() => setError("")} dismissible>
                  {error}
                </Alert>
              )}

              {/* Profile Details */}
              <Row>
                <Col md={6}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-3">Hello! {userDetails.name}</h4>
                    <Button variant="link" className="p-0" onClick={() => navigate("/edit-profile")}>
                      <FaEdit /> Edit
                    </Button>
                  </div>
                  <p className="text-muted">{userDetails.email}</p>
                </Col>
              </Row>

              {/* Profile Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    name="name"
                    value={userDetails.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mt-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group controlId="formPhone" className="mt-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your phone number"
                    name="phone"
                    value={userDetails.phone}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    name="password"
                    value={userDetails.password}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mt-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    name="confirmPassword"
                    value={userDetails.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                  <Button variant="primary" type="submit">
                    Update Profile
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigate("/"); // Navigate back to home or dashboard
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
