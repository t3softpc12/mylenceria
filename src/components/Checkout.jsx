import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const Checkout = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "cod",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
  };

  return (
    <Container className="py-4">
      <Row className="g-4">
        {/* Left: Billing Info */}
        <Col lg={8} md={7}>
          <Card className="border-0 shadow rounded-4 p-4">
            <h4 className="fw-bold mb-4">Billing & Shipping Details</h4>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-muted">
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="py-2 rounded-3 border border-light shadow-sm"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-muted">
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      className="py-2 rounded-3 border border-light shadow-sm"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-muted">
                      Phone Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="py-2 rounded-3 border border-light shadow-sm"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-muted">
                      Zip Code
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="zip"
                      placeholder="e.g. 400001"
                      value={formData.zip}
                      onChange={handleChange}
                      className="py-2 rounded-3 border border-light shadow-sm"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-muted">
                  Full Address
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  placeholder="Flat no, street, area, landmark"
                  value={formData.address}
                  onChange={handleChange}
                  className="rounded-3 border border-light shadow-sm"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-muted">
                      City
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={handleChange}
                      className="py-2 rounded-3 border border-light shadow-sm"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-muted">
                      State
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      placeholder="Enter state"
                      value={formData.state}
                      onChange={handleChange}
                      className="py-2 rounded-3 border border-light shadow-sm"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h5 className="fw-bold mt-4">Payment Method</h5>
              <Form.Check
                type="radio"
                label="Cash on Delivery"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={handleChange}
                className="mt-2"
              />
              <Form.Check
                type="radio"
                label="Credit / Debit Card"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={handleChange}
                className="mt-2"
              />
              <Form.Check
                type="radio"
                label="UPI / Netbanking"
                name="paymentMethod"
                value="upi"
                checked={formData.paymentMethod === "upi"}
                onChange={handleChange}
                className="mt-2"
              />
            </Form>
          </Card>
        </Col>

        {/* Right: Order Summary */}
        <Col lg={4} md={5}>
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <h4 className="fw-bold mb-4">Order Summary</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Item Subtotal</span>
              <span>₹2,499</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span>Discount</span>
              <span>- ₹200</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>Total</span>
              <span>₹2,299</span>
            </div>
            <Button
              variant="dark"
              className="w-100 py-2 rounded-pill fw-semibold"
              style={{ backgroundColor: "#232c85", border: "none" }}
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
