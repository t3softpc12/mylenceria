import React from "react";
import { useCart } from "../context/CartContext";
import { FaTrashAlt, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Checkout from "../components/Checkout";

const Cart = ({ showCart, toggleCart }) => {
  const { cart, removeFromCart, addToCart, removeQuantity, toggleSelect } = useCart();

  if (!showCart) return null;

  // 🧮 Filter selected items for price calculations
  const selectedItems = cart.filter((item) => item.selected);
  const subtotal = selectedItems.reduce(
    (sum, item) =>
      sum +
      (item.special_price ? parseInt(item.special_price.replace(/[₹,]/g, "")) * item.qty : 0),
    0
  );

  const originalTotal = selectedItems.reduce(
    (sum, item) =>
      sum +
      (item.customer_mrp
        ? parseInt(item.customer_mrp.replace(/[₹,]/g, "")) * item.qty
        : parseInt(item.special_price.replace(/[₹,]/g, "")) * item.qty),
    0
  );

  const savings = originalTotal - subtotal;
  const savingPercent = originalTotal
    ? ((savings / originalTotal) * 100).toFixed(1)
    : 0;

  const convenienceCharge = selectedItems.length > 0 ? 10 : 0;
  const shipping = 0;
  const totalPayable =
    subtotal > 0 ? subtotal + convenienceCharge + shipping : 0;

  return (
    <>
      <Modal
        show={showCart}
        onHide={toggleCart}
        size="lg"
        centered
        className="cart-sidebar hide-scrollbar border-0 "
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 2000,
          width: "25vw",
          maxWidth: "100%",
          transition: "right 0.3s ease-in-out",
          backgroundColor: "#fff",
        }}
      >
        <Modal.Body className="" style={{ padding: "0" }}>
          <div className="p-3" style={{ height: "100%", overflowY: "auto" }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3 ">
              <h4 className="m-0">Cart </h4>
              <button className="btn" onClick={toggleCart}>
                <FaTimes />
              </button>
            </div>

            {/* Cart Items */}
            {cart.map((item) => (
              <div
                key={item.id}
                className="border rounded p-3 mb-3 position-relative"
                style={{ backgroundColor: "#fff" }}
              >
                {/* ✅ Checkbox at top-right corner */}
                <div
                  className="position-absolute"
                  style={{
                    top: "10px",
                    right: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.selected || false}
                    onChange={() => toggleSelect(item.id)}
                    className="form-check-input"
                    style={{
                      accentColor: "#ff7f73", // your theme pink instead of default blue
                      cursor: "pointer",
                    }}
                  />
                </div>

                <div className="d-flex gap-3">
                  <img
                    src={item.img1}
                    alt={item.productname}
                    width="100"
                    height="100"
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />

                  <div className="flex-grow-1 d-flex flex-column justify-content-between">
                    <div>
                      <p className="fw-semibold mb-1">{item.productname}</p>
                      <p className="text-muted small mb-1">Size: {item.size}</p>
                      <p className="text-muted small mb-2">Color: {item.color}</p>

                      {/* Price */}
                      <p className="mb-2">
                        <span className="text-decoration-line-through text-muted me-2">
                          {item.customer_mrp}
                        </span>
                        <span className="fw-bold text-dark">{item.special_price}</span>
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <button
                        className="btn btn-outline-dark btn-sm px-2 py-0"
                        onClick={() => removeQuantity(item.id)}
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        className="btn btn-outline-dark btn-sm px-2 py-0"
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* 🗑️ Delete button — bottom-right corner */}
                <div
                  className="position-absolute"
                  style={{
                    bottom: "10px",
                    right: "10px",
                  }}
                >
                  <button
                    className="btn btn-sm text-danger"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove from cart"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}

            {/* Price Details */}
            <div className="border-top pt-3" style={{ fontSize: "0.9vw" }}>
              <h6 className="fw-bold mb-2">PRICE DETAILS</h6>

              {selectedItems.length === 0 ? (
                <p className="text-muted small">Select items to see total.</p>
              ) : (
                <>
                  <div className="d-flex justify-content-between">
                    <span>Total M.R.P :</span>
                    <span>₹{originalTotal.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between text-danger">
                    <span>Savings on M.R.P :</span>
                    <span>(-) ₹{savings.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Saving % :</span>
                    <span className="text-success fw-semibold">
                      {savingPercent}% OFF
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Sub-total :</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Shipping :</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Convenience charges :</span>
                    <span>₹{convenienceCharge}</span>
                  </div>

                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Net Payable :</span>
                    <span>₹{totalPayable.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            {/* Checkout */}
            <div className="mt-4">
              <Link
                to="/checkout"
                state={{ selectedItems }}
                className={`btn rounded-pill px-4 py-2 w-100 ${
                  selectedItems.length > 0 ? "btn-dark" : "btn-secondary disabled"
                }`}
              >
                Continue to Checkout
              </Link>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Cart;
