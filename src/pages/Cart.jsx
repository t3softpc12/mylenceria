import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useCart } from "../context/CartContext";
import { FaTrashAlt, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Cart = forwardRef((props, ref) => {
  const { cart, removeFromCart, updateCart } = useCart();
  const [openCart, setOpenCart] = useState(false);
  const navigate = useNavigate();
  const { user, openLoginPopup } = useAuth();  // ← get user here

  useImperativeHandle(ref, () => ({
  openCartDrawer: () => {
    setOpenCart(true);
  }
}));

  const closeCart = () => setOpenCart(false);

  // ---------------- SELECTED ITEMS & STOCK CHECK ----------------
  const selectedItems = cart.filter((item) => item.selected);
  // console.log("Selected Items in Cart:", selectedItems);

  // Find out of stock selected items
  const outOfStockItems = selectedItems.filter((item) => item.stock < 1);
  const hasOutOfStock = outOfStockItems.length > 0;

  // ---------------- PRICE CALCULATION ----------------
const getBestPrice = (item) => {
  if (item.special_price !== null && item.special_price > 0) return item.special_price;
  if (item.discount_price > 0) return item.discount_price;
  return item.customer_mrp;
};

const subtotal = selectedItems.reduce((sum, item) => sum + getBestPrice(item) * item.qty, 0);

const originalTotal = selectedItems.reduce((sum, item) => sum + item.customer_mrp * item.qty, 0);

const savings = originalTotal - subtotal;
const savingPercent = originalTotal > 0 ? Math.round((savings / originalTotal) * 100) : 0;

const totalPayable = subtotal > 0 ? subtotal : 0;

  // ---------------- REMOVE ALL OUT OF STOCK ----------------
  const removeOutOfStockItems = () => {
    outOfStockItems.forEach((item) => removeFromCart(item.id));
  };

  return (
    <>
      {/* -------------- OVERLAY -------------- */}
      {openCart && (
        <div
          onClick={closeCart}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 2000,
          }}
        ></div>
      )}

      {/* -------------- RIGHT SIDE CART DRAWER -------------- */}
      {/* <div
        style={{
          position: "fixed",
          top: 0,
          right: openCart ? "0" : "-30vw", // slide animation
          width: "24vw",
          height: "100vh",
          background: "#fff",
          boxShadow: "0 0 15px rgba(0,0,0,0.3)",
          transition: "right 0.4s ease-in-out",
          zIndex: 3000,
          overflowY: "auto",
        }}
        className="hide-scrollbar"
      > */}

      <div
  style={{
    position: "fixed",
    top: 0,
    right: openCart ? "0" : "-30vw",
    width: "24vw",
    height: "100vh",
    background: "#fff",
    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
    transition: "right 0.4s ease-in-out",
    zIndex: 3000,
    display: "flex",
    flexDirection: "column"   // IMPORTANT
  }}
>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h4 className="m-0">Cart ({cart.length})</h4>
          <FaTimes size={20} onClick={closeCart} style={{ cursor: "pointer" }} />
        </div>

        {/* Cart Items */}
        <div className="p-3 flex-grow-1 overflow-auto">
          {cart.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: "#f5f7fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <i
                  className="fa fa-shopping-cart"
                  style={{ fontSize: 36, color: "#9aa4b2" }}
                />
              </div>

              <h5 className="fw-semibold mb-2">Your cart is empty</h5>

              <p className="text-muted text-center mb-4" style={{ maxWidth: 260 }}>
                Looks like you haven’t added anything to your cart yet.
              </p>

            <button
                className="btn bg-pink px-4"
                onClick={() => {
                  closeCart();          // close drawer
                  navigate("/shop");   // navigate
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* OUT OF STOCK WARNING BANNER */}
              {hasOutOfStock && (
                <div className="alert alert-danger mb-3 p-3">
                  <strong>{outOfStockItems.length} selected item(s) are out of stock:</strong>
                  <ul className="mt-2 mb-0 ps-4">
                    {outOfStockItems.map((item) => (
                      <li key={item.id} className="small">
                        {item.product_name || item.productname} 
                        {item.size && ` (Size: ${item.size})`}
                        {item.color && `, Color: ${item.color}`}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="btn btn-sm btn-outline-danger mt-2 w-100"
                    onClick={removeOutOfStockItems}
                  >
                    Remove out of stock items
                  </button>
                </div>
              )}

              {/* Cart Items */}
          {cart.map((item) => {
            // Determine the best current price
            const hasSpecial = item.special_price !== null && item.special_price > 0;
            const hasDiscount = item.discount_price > 0;
            const displayPrice = hasSpecial 
              ? item.special_price 
              : hasDiscount 
                ? item.discount_price 
                : item.customer_mrp;

            const showStrikethrough = hasSpecial || hasDiscount;

            return (
                  <div
                    key={item.id}
                    className={`border rounded p-3 mb-3 position-relative ${
                      item.stock < 1 ? "opacity-75" : ""
                    }`}
                    style={{ backgroundColor: "#fff" }}
                  >
                <input
                  type="checkbox"
                  checked={item.selected || false}
                      onChange={(e) =>
                        updateCart(item.id, { selected: e.target.checked ? 1 : 0 })
                      }
                      disabled={item.stock < 1}
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        accentColor: "#ff4d6d",
                      }}
                    />

                    <div style={{ display: "flex", gap: "16px" }}>
                  <img
                    src={item.image || item.img1}
                    alt={item.product_name || item.productname}
                    // width="100"
                    height="100"
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />

                  <div className="flex-grow-1">
                        {item.stock < 1 && (
                          <span className="badge bg-danger px-3 mb-2 d-block">Out of stock</span>
                        )}

                                        <p className="fw-semibold mb-1">{item.product_name || item.productname}</p>
                    {(item.size || item.color) && (
                      <p className="text-muted small mb-1">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && " | "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    )}

                    {/* PRICE DISPLAY */}
                    <div className="mb-2">
                      {showStrikethrough && (
                        <del className="text-muted me-2 small">₹{item.customer_mrp}</del>
                      )}

                      <span className="fw-bold text-dark fs-6">
                        ₹{displayPrice}
                      </span>

                      {/* Special Offer Badge */}
                      {hasSpecial && (
                            <span
                              style={{
                                background: "#dc3545",
                                color: "white",
                                fontSize: "11px",
                                padding: "2px 1px",
                                borderRadius: "12px",
                                marginLeft: "8px",
                              }}
                            >
                              SPECIAL
                        </span>
                      )}
                    </div>

                        {/* Quantity */}
                        <div style={{ display: "flex", alignItems: "center"}}>
                      <button
                            className="btn btn-outline-secondary btn-sm rounded-circle"
                        disabled={item.qty <= 1}
                        onClick={() => updateCart(item.id, { qty: item.qty - 1 })}
                            style={{ width: "25px", height: "25px", padding: 0 }}
                      >
                        -
                      </button>
                          <span style={{ fontWeight: 600, minWidth: "30px", textAlign: "center" }}>
                            {item.qty}
                          </span>
                      <button
                            className="btn btn-outline-secondary btn-sm rounded-circle"
                        disabled={item.qty >= item.stock}
                        onClick={() => updateCart(item.id, { qty: item.qty + 1 })}
                            style={{ width: "25px", height: "25px", padding: 0 }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeFromCart(item.id)}
                      style={{
                        position: "absolute",
                        bottom: "16px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        color: "#ff4d6d",
                        cursor: "pointer",
                      }}
                >
                      <FaTrashAlt size={18} />
                </button>
              </div>
            );
          })}
            </>
          )}
        </div>

        {/* Sticky Price Details + Checkout Button */}
{cart.length > 0 && (
  <div
    className="border-top bg-white shadow"
    style={{ zIndex: 5 }}
  >
    <div className="p-3 p-md-4">

      {/* <h6 className="fw-semibold mb-3 text-uppercase small text-muted">
        Price Details
      </h6> */}

      {selectedItems.length === 0 ? (
        <p className="text-muted small mb-3">
          Select items to see total.
        </p>
      ) : (
        <>
          <div className="d-flex justify-content-between mb-2 small">
            <span>Total MRP</span>
            <span>₹{originalTotal.toLocaleString()}</span>
          </div>

          <div className="d-flex justify-content-between text-success mb-2 small">
            <span>Savings</span>
            <span>
              -₹{savings.toLocaleString()} ({savingPercent}% OFF)
            </span>
          </div>

          <div className="d-flex justify-content-between mb-1 small">
            <span>Sub-total</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          <hr />

          <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
            <span>Net Payable</span>
            <span>₹{totalPayable.toLocaleString()}</span>
          </div>
        </>
      )}

      {/* Checkout Button */}
      <button
        onClick={() => {
          if (selectedItems.length === 0 || hasOutOfStock) return;

          if (!user) {
            openLoginPopup();
            closeCart();
            return;
          }

          closeCart();
          navigate("/checkout", { state: { selectedItems } });
        }}
        className={`btn w-100 fw-semibold rounded-pill shadow ${
          selectedItems.length > 0 && !hasOutOfStock
            ? "btn-danger"
            : "btn-secondary disabled"
        }`}
      >
        {hasOutOfStock
          ? "Remove Out-of-Stock Items"
          : "Proceed to Checkout"}
      </button>

      {/* Continue Shopping */}
      {/* <div className="text-center mt-3">
        <button
          onClick={() => {
            closeCart();
            navigate("/shop");
          }}
          className="btn btn-link text-danger text-decoration-none small"
        >
          Continue Shopping →
        </button>
      </div> */}

    </div>
  </div>
)}

      </div>
    </>
  );
});

export default Cart;
