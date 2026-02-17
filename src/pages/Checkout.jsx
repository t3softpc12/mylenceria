import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AffordabilityWidget from "../components/AffordabilityWidget";

const Checkout = ({ handlePlaceOrder }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const cartItems = location.state?.selectedItems || [];
  console.log(cartItems);
  
  const { user, loading } = useAuth();
  const account_id = user?.accountid;

  const validCoupons = {
    DISCOUNT10: 10,
    SAVE200: 200,
  };

  /* ---------- LOAD ADDRESSES ---------- */
useEffect(() => {
  if (!account_id) return;

  const fetchAddresses = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SHIPPING_ADDRESS}?account_id=${account_id}`
      );
      const data = await res.json();

      if (data.success) {
        setAddresses(data.addresses || []);

        // Auto select DEFAULT address
        const def = data.addresses.find(a => a.is_default == 1);
        if (def) {
          setSelectedAddressId(def.addressid);
          setSelectedAddress(def);
        }
      }
    } catch (err) {
      console.error("Failed to fetch addresses");
    }
  };

  fetchAddresses();
}, [account_id]);


  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId) {
      const addr = addresses.find((a) => a.addressid === selectedAddressId);
      setSelectedAddress(addr || null);
    }
  }, [selectedAddressId, addresses]);

  const handleAddressChange = (e) => {
    setSelectedAddressId(Number(e.target.value));
  };

  /* ---------- PAYMENT ---------- */
  const handlePaymentMethodChange = (m) => setPaymentMethod(m);

/* ------------------ PRICE CALC ----------------- */
const getBestPrice = (item) => {
  if (item.special_price !== null && item.special_price > 0) return item.special_price;
  if (item.discount_price > 0) return item.discount_price;
  return item.customer_mrp;
};

const subtotal = cartItems.reduce((sum, item) => sum + getBestPrice(item) * item.qty, 0);
const originalMrpTotal = cartItems.reduce((sum, item) => sum + item.customer_mrp * item.qty, 0);
const savings = originalMrpTotal - subtotal;

const discount = discountApplied ? validCoupons[couponCode] || 0 : 0;
const totalAmount = Math.max(0, subtotal - discount);

  /* ------------------ EARLIEST DATE ---------------- */

  const onPlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Select a delivery address.");
      return;
    }

    try {
      const payload = {
        account_id,                              // logged in user
        subject: "Online Order",                 // or dynamic
        orderdate: new Date().toISOString().slice(0, 10),

        subtotal,
        total: totalAmount,

        addressid: selectedAddress.addressid,
        full_name: selectedAddress.full_name,
        phone: selectedAddress.phone,
        address: selectedAddress.street,
        area: selectedAddress.ship_area,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country || "India",
        pin: selectedAddress.code,
        

        products: cartItems.map(item => ({
          productid: item.product_id,
          quantity: item.qty,
          listprice: item.customer_mrp,
          unitprice: getBestPrice(item),
          discount: (item.customer_mrp - getBestPrice(item)) * item.qty,
          skucode: item.skucode || "",
          unit: item.unit || 1,
          packsize: item.packsize || "",
          shade: item.shade || ""
        }))
      };


      const res = await fetch(import.meta.env.VITE_PLACE_ORDER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data?.success === true) {
        navigate("/order-success");
      } else {
        alert(data?.message || "Order failed");
      }

    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }

  };



  return (
    <Container fluid className="py-2 px-5">
      <Row>
        {/* LEFT PANEL */}
        <Col lg={4} md={5} sm={12} className="mb-4 mb-md-0">
          {/* EXPECTED DELIVERY */}
          <div className="fs-6 fw-bold mb-2">
            Expected Delivery by{" "}
            <span className="text-muted fs-6"> (Few may arrive earlier)</span>
          </div>

          {/* ADDRESS BOX */}
          <div className="bg-light p-3 rounded-3 mb-3">
            <div className="fs-6 fw-bold mb-2">Delivering To</div>

            {addresses.length === 0 ? (
              <Alert variant="info">
                No saved addresses.{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => navigate("/account?section=address")}
                >
                  Add Address
                </Button>
              </Alert>
            ) : (
              <>
                <Form>
                  {addresses.map((addr) => (
                    <Form.Check
                      key={addr.addressid}
                      type="radio"
                      name="addr"
                      value={addr.addressid}
                      checked={selectedAddressId === addr.addressid}
                      onChange={() => setSelectedAddressId(addr.addressid)}
                      className="mb-3"
                      label={
                        <div className="fs-9">
                          <strong>{addr.address_type}</strong> — {addr.full_name} ({addr.phone})
                          <br />
                          {addr.ship_area && `${addr.ship_area}, `}
                          {addr.street}, {addr.city}, {addr.state} - {addr.code}
                        </div>
                      }
                    />
                  ))}
                </Form>


                <Button
                  variant="link"
                  className="p-0 fs-9 text-danger fw-semibold"
                  onClick={() => navigate("/account?section=address")}
                >
                  Change
                </Button>
              </>
            )}
          </div>

          {/* <div className="border p-3 rounded-3 mb-3" style={{ background: "#f6f6f6" }}>
            <div className="d-flex align-items-center gap-2">
              <div className="bg-light rounded-3" style={{ width: "30px", height: "30px" }}></div>
              <span className="fs-6 fw-medium">zCash</span>
              <span className="ms-auto fw-bold">₹0</span>
            </div>
          </div> */}

          {/* PAYMENTS TITLE */}
          <div className="fs-5 fw-bold mb-3">Payments</div>

          {/* PAYMENT OPTIONS */}
          {[{ key: "upi", label: "UPI" }, { key: "card", label: "CREDIT/DEBIT CARD" }, { key: "cod", label: "Cash on Delivery" }]
            .map((p) => (
              <div
                key={p.key}
                onClick={() => handlePaymentMethodChange(p.key)}
                className="p-3 mb-3 border rounded-3 cursor-pointer d-flex align-items-center gap-3"
                style={{ background: "#f5f5f5" }}
              >
                <input
                  type="radio"
                  checked={paymentMethod === p.key}
                  onChange={() => handlePaymentMethodChange(p.key)}
                />
                <span className="fs-6 fw-semibold">{p.label}</span>
              </div>
          ))}

          {/* OTHER PAYMENT OPTIONS */}
          <div className="fs-9 text-muted mb-2">Other Payment Options</div>

          <div className="p-3 mb-3 border rounded-3" style={{ background: "#f5f5f5" }}>
            <input type="radio" /> <span className="ms-2">NET BANKING</span>
          </div>

          <div className="p-3 border rounded-3" style={{ background: "#f5f5f5" }}>
            <input type="radio" /> <span className="ms-2">PAYMENT LINK</span>
          </div>

          {/* <AffordabilityWidget key='OADt8R' amount='6000'/>
          <div>payu component</div> */}
        </Col>

        {/* ================= RIGHT SIDE ================= */}
        <Col lg={8} md={7} sm={12}>
          {/* REVIEW ORDER */}
          <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex justify-content-between mb-2">
              <h5 className="fw-bold">Review order</h5>
              <span className="fs-9 fw-semibold">Items: {cartItems.length}</span>
            </div>

            <hr />

            {/* Inside the cartItems.map() in Review Order section */}
            {cartItems.map((item, i) => {
              // Determine best current price
              const hasSpecial = item.special_price !== null && item.special_price > 0;
              const hasDiscount = item.discount_price > 0;
              const displayPrice = hasSpecial 
                ? item.special_price 
                : hasDiscount 
                  ? item.discount_price 
                  : item.customer_mrp;

              const showStrikethrough = hasSpecial || hasDiscount;

              return (
                <div key={i}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fs-9 fw-medium">Sold by: {item.seller || "Mylenceria"}</span>
                    <span className="fs-10 text-danger fw-medium">
                      Arriving on {item.arrivalDate || "Soon"}
                    </span>
                  </div>

                  <div className="d-flex">
                    <img
                      src={item.img1 || item.image}
                      alt={item.productname}
                      className="rounded-3"
                      style={{
                        width: "6vw",
                        height: "100%",
                        objectFit: "cover",
                        marginRight: "1rem",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p className="fs-9 fw-semibold mb-2">{item.productname}</p>
                      <p className="fs-10 text-muted mb-2">
                        {item.size && `Size: ${item.size}`} <br />
                        Qty: {item.qty}
                      </p>

                      {/* PRICE DISPLAY WITH SPECIAL SUPPORT */}
                      <div className="d-flex align-items-center gap-2">
                        {showStrikethrough && (
                          <del className="text-muted small">₹{item.customer_mrp}</del>
                        )}
                        <strong className="text-danger fs-5">₹{displayPrice}</strong>
                        {hasSpecial && (
                          <span className="badge bg-gradient-red text-light px-2 py-1 small" >
                            Offer price applied!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr className="my-3" />
                </div>
              );
            })}
          </Card>

          {/* ORDER SUMMARY */}
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2">
              <span>Bag Total (MRP)</span>
              <span>₹{originalMrpTotal.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2 text-success">
              <span>Product Savings</span>
              <span>-₹{savings.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {discountApplied && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Coupon Discount ({couponCode})</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}

            <hr />

            <div className="d-flex justify-content-between fw-bold fs-4">
              <span>Total Payable</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>

            {savings > 0 && (
              <div className="text-center text-success mt-3 fw-bold">
                You saved ₹{savings.toFixed(2)} on this order!
              </div>
            )}
            
            <Button
              className="w-100 mt-4 py-3"
              style={{ background: "#333", border: "none", fontSize: "18px" }}
              onClick={onPlaceOrder}
              disabled={!selectedAddress || cartItems.length === 0}
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
