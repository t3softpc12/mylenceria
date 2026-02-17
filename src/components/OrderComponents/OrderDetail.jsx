// src/pages/OrderDetail.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const OrderDetail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  const { orderId } = useParams();
  const user_id =  user?.user_id;
  console.log("orderrrr id", orderId);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("user_id",user_id, "orderid", orderId)
    // if (!user?.user_id || !orderId) {
    //   // navigate("/account");
    //   alert('something went wrong');
    //   return;
    // }

    // Fetch single order details
    fetch(`${import.meta.env.VITE_FETCH_ORDER_DETAIL}?order_id=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("ORDER API RESPONSE", data);
          setOrder(data.order);
        } else {
          alert("Order not found");
          navigate("/account?section=orders");
        }
      })
      .catch(() => alert("Error loading order"))
      .finally(() => setLoading(false));
  }, [orderId, user, navigate]);

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "in progress":
        return { color: "#ffa500", badge: "warning" };
      case "delivered":
        return { color: "#28a745", badge: "success" };
      case "cancelled":
        return { color: "#dc3545", badge: "danger" };
      default:
        return { color: "#6c757d", badge: "secondary" };
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!order) return null;

  const statusInfo = getStatusInfo(order.status);


const getEffectivePrice = (item) => {
  if (item.special_price && item.special_price > 0) {
    return {
      price: item.special_price,
      type: "special"
    };
  }

  if (item.discount_price && item.discount_price > 0) {
    return {
      price: item.discount_price,
      type: "discount"
    };
  }

  return {
    price: item.customer_mrp,
    type: "mrp"
  };
};





  return (
    <div className="container py-4">
      <Button
        variant="link"
        className="ps-0 mb-3 text-muted"
        onClick={() => navigate(-1)}
      >
        ← Back to Orders
      </Button>

      <div className="bg-white rounded-4 shadow-sm p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h5 className="mb-1">Order ID: {order.order_id}ODR</h5>
            <p className="text-muted mb-0">
              Placed on {new Date(order.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="text-end">
            <div className="d-flex align-items-center justify-content-end mb-2">
              <div
                className="me-2 rounded-circle"
                style={{ width: "12px", height: "12px", backgroundColor: statusInfo.color }}
              />
              <Badge bg={statusInfo.badge} className="text-capitalize fs-6">
                {order.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Items */}
        <h5 className="mb-3">Items ({order.items.length})</h5>
          {order.items.map((item, index) => {
            const { price, type } = getEffectivePrice(item);
            const totalPrice = item.quantity * price;

            return (
              <div key={index} className="d-flex mb-4 align-items-center">
                <img
                  src={item.image || "/no-image.png"}
                  alt={item.name}
                  className="rounded me-3"
                  style={{ width: "80px", height: "120px", objectFit: "cover" }}
                />

                <div className="flex-grow-1">
                  <h6 className="mb-1">{item.name}</h6>

                  <p className="mb-1">Qty: {item.quantity}</p>

                  {/* PRICE DISPLAY */}
                  <div className="d-flex align-items-center gap-2">
                    {/* Effective Price */}
                    <strong className={type === "special" ? "text-danger" : "text-dark"}>
                      ₹ {price.toLocaleString("en-IN")}
                    </strong>

                    {/* MRP (striked if discounted) */}
                    {(type === "special" || type === "discount") && (
                      <span className="text-muted text-decoration-line-through">
                        ₹ {item.customer_mrp.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                {/* TOTAL */}
                <strong className="ms-3">
                  ₹ {totalPrice.toLocaleString("en-IN")}
                </strong>
              </div>
            );
          })}


        <hr />

        {/* Price Breakdown */}
        <div className="text-end mb-4">
          {/* <p className="mb-2">Subtotal: <strong>₹ {item.customer_mrp}</strong></p> */}
          <h5>Total Paid: <strong className="text-danger">₹ {order.total.toLocaleString("en-IN")}</strong></h5> 
        </div>

        <hr />

        {/* Delivery Address */}
        <div className="mb-4">
          <h5>Delivery Address</h5>
          <p className="mb-0">
            {order.address.full_name}<br />
            {order.address.ship_area}<br/>
            {order.address.street}<br />
            {order.address.city}, {order.address.state} - {order.address.pincode}<br />
            Phone: {order.address.phone}
          </p>
        </div>

        {/* Actions */}
        <div className="d-flex gap-3 mt-4">
          {order.status === "in progress" && (
            <Button variant="outline-danger">Cancel Order</Button>
          )}
          {order.trackingUrl && (
            <Button variant="success" onClick={() => window.open(order.trackingUrl, "_blank")}>
              Track Package
            </Button>
          )}
          <Button variant="outline-secondary">Need Help?</Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;