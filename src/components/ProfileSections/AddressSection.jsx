import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

const AddressSection = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [defaultAdd, setDefaultAdd] = useState(null);
  const { user } = useAuth();
  console.log("user", user)

  const account_id = user.accountid;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    ship_area: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    address_type: "", // ← New field
  });

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!account_id) return;

    try {
      const res = await axios.get(import.meta.env.VITE_SHIPPING_ADDRESS, {
        params: { account_id },
      });

      if (res.data.success) {
        setAddresses(res.data.addresses || []);
        const def = res.data.addresses?.find((a) => a.is_default);
        if (def) setSelectedAddressId(def.addressid);
      }
    } catch (err) {
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    fetchAddresses().finally(() => setLoading(false));
  }, [account_id]);

  // When editing, fill form
  useEffect(() => {
    if (editingAddress) {
      setFormData({
        fullName: editingAddress.full_name || "",
        phone: editingAddress.phone || "",
        ship_area: editingAddress.ship_area || "",
        street: editingAddress.street || "",
        city: editingAddress.city || "",
        state: editingAddress.state || "",
        postalCode: editingAddress.code || "",
        country: editingAddress.country || "India",
        address_type: editingAddress.address_type || "",
      });
    } else {
      setFormData({
        fullName: "",
        phone: "",
        ship_area: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        address_type: "",
      });
    }
  }, [editingAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Full Name is required");
      return;
    }

    if (!account_id) {
      toast.error("User not logged in");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...formData,
        account_id,
        address_type: formData.address_type,
      };

      if (editingAddress?.addressid) {
        await axios.put(import.meta.env.VITE_SHIPPING_ADDRESS, {
          ...payload,
          addressid: editingAddress.addressid,
        });

        toast.success("Address updated!");
      } else {
        await axios.post(import.meta.env.VITE_SHIPPING_ADDRESS, payload);

        toast.success("Address added!");
      }

      setEditingAddress(null);
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  const setDefaultAddress = async (addressid) => {
    try {
      await axios.put(import.meta.env.VITE_SHIPPING_ADDRESS, {
        account_id,
        addressid,
        set_default: true,
      });

      toast.success("Default address updated");
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to set default address");
    }
  };

  const deleteAddress = async (addressid) => {
    if (!addressid) return;
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    try {
      await axios.delete(import.meta.env.VITE_SHIPPING_ADDRESS, {
        params: {
          account_id,
          addressid,
        },
      });

      toast.success("Address deleted successfully");
      if (selectedAddressId === addressid) {
        setSelectedAddressId(null);
      }

      fetchAddresses();
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Saved Addresses</h3>

        {/* Add New Address Button */}
        <Button
          style={{ backgroundColor: "#160402", border: "none" }}
          onClick={() => setEditingAddress({})} // Open empty form
        >
          + Add New Address
        </Button>
      </div>

      {/* Address Form (only show when adding or editing) */}
      {editingAddress !== null && (
        <div className="bg-white p-4 rounded shadow-sm mb-4 border">
          <h5 className="mb-4">
            {editingAddress.addressid ? "Edit Address" : "Add New Address"}
          </h5>

          {/* Address Type Pills */}
          <div className="mb-4">
            {["Home", "Office", "Other"].map((type) => (
              <Button
                key={type}
                variant={
                  formData.address_type === type
                    ? "danger"
                    : "outline-secondary"
                }
                className="me-2 mb-2"
                size="sm"
                onClick={() => setFormData({ ...formData, address_type: type })}
              >
                {type}
              </Button>
            ))}
          </div>

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Full Name"
                  required
                />
              </Col>

              <Col md={6}>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Phone Number"
                />
              </Col>

              <Col md={12}>
                <Form.Label>Flat / House No / Building</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.ship_area}
                  onChange={(e) =>
                    setFormData({ ...formData, ship_area: e.target.value })
                  }
                  placeholder="e.g. A-301"
                />
              </Col>

              <Col md={12}>
                <Form.Label>Street / Area / Locality</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  placeholder="Full street address"
                  required
                />
              </Col>

              <Col md={4}>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="City"
                  required
                />
              </Col>

              <Col md={4}>
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="State"
                  required
                />
              </Col>

              <Col md={4}>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  placeholder="PIN Code"
                />
              </Col>

              <Col md={12} className="text-end">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => setEditingAddress(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  style={{ backgroundColor: "#160402", border: "none" }}
                >
                  {saving ? "Saving..." : "Save Address"}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}

      {/* Saved Addresses List */}

      <div className="">
        {addresses.length === 0 ? (
          <p className="text-center text-muted py-5">No addresses saved yet.</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.addressid}
              className={`address-card border rounded-3 p-3 mb-3 shadow ${
                selectedAddressId === addr.addressid
                  ? "border-danger bg-light"
                  : "border-light"
              }`}
              style={{
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => setSelectedAddressId(addr.addressid)}
            >
              {/* HEADER */}
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-0 fw-semibold">
                    {addr.full_name}

                    {addr.address_type && (
                      <span className="text-muted bg-pink rounded py-1 px-2 ms-3 small">
                        {addr.address_type}
                      </span>
                    )}

                    {addr.is_default == 1 && (
                      <span className="badge text-danger bg-white border border-danger shadow-sm ms-2">
                        Default
                      </span>
                    )}
                  </h6>
                </div>

                {/* ICON ACTIONS */}
                <div className="d-flex gap-3 fs-5">
                  <FiEdit2
                    title="Edit"
                    className="text-dark action-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingAddress(addr);
                    }}
                  />

                  <FiTrash2
                    title="Delete"
                    className="text-dark action-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAddress(addr.addressid);
                    }}
                  />

                  {addr.is_default != 1 && (
                    <FiCheckCircle
                      title="Set Default"
                      className="text-success action-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDefaultAddress(addr.addressid);
                      }}
                    />
                  )}
                </div>
              </div>

              {/* ADDRESS DETAILS */}
              <div className="mt-1">
                <small className="text-muted d-flex align-items-center mb-1">
                  <FiPhone className="me-1 text-primary" />
                  {addr.phone}
                </small>

                <p className="mb-1 text-muted small d-flex align-items-center">
                  <FiMapPin className="me-1 text-success" />
                  {addr.ship_area}
                  {addr.ship_area && ", "}
                  {addr.street}
                </p>

                <p className="text-muted small">
                  {addr.city}, {addr.state} – {addr.code}
                </p>
              </div>

              {/* SELECTED INDICATOR */}
              {selectedAddressId === addr.addressid && (
                <div className=" text-end">
                  <span className="badge bg-danger-subtle text-danger fw-semibold">
                    Selected for delivery
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AddressSection;
