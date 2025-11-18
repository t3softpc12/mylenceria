import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const Register = ({ show, handleClose }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="border-0 shadow-lg rounded-4"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-4 text-center w-100">
          Create Your Account ✨
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <p className="text-center text-muted mb-4">
          Join our community — it only takes a minute!
        </p>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small text-muted">
              Full Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              className="py-2 rounded-3 border border-light shadow-sm"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small text-muted">
              Email Address
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              className="py-2 rounded-3 border border-light shadow-sm"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold small text-muted">
              Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Create password"
              className="py-2 rounded-3 border border-light shadow-sm"
            />
          </Form.Group>

          <Button
            variant="dark"
            className="w-100 py-2 rounded-pill fw-semibold"
            style={{ backgroundColor: "#232c85", border: "none" }}
          >
            Sign Up
          </Button>

          <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: "13px" }}>
            Already have an account?{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
            >
              Login
            </span>
          </p>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Register;
