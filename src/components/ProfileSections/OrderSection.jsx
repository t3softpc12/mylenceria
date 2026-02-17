import React, { useEffect, useState } from "react";
import { Badge, Spinner } from "react-bootstrap"; // Added Spinner for loading
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const OrderSection = () => {
  const { user } = useAuth();
  const account_id = user?.accountid;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!account_id) return;

    fetch(`${import.meta.env.VITE_FETCH_ORDERS}?account_id=${account_id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .finally(() => setLoading(false));
  }, [account_id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // Outputs like "10 May 2021"
  };



  const handleOrderClick = (orderId) => {
    console.log("order id from orders section", orderId);
    navigate(`/order-detail/${orderId}`);
  };


  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return { color: 'orange', text: 'warning' };
      case 'delivered':
        return { color: 'green', text: 'success' };
      default:
        return { color: 'gray', text: 'secondary' };
    }
  };

  if (loading) {
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <h3 className="mb-4">Your Orders</h3>

      {orders.length === 0 ? (
        <p className="text-muted text-center py-5">No recent orders.</p>
      ) : (
        orders.map((o) => {
          const statusInfo = getStatusVariant(o.status);
          return (
            <div
              key={o.orderid}
              className="mb-4 p-4 bg-white rounded-4 shadow-sm d-flex align-items-center"
              style={{ cursor: 'pointer' }} // Makes whole card clickable if needed
              onClick={() => console.log("View order", o.orderid)}
            >
              {/* Product Image */}
              <img
                src={o.image || "/no-image.png"}
                alt={o.product}
                className="rounded me-4"
                style={{ width: "10vh", height: "15vh", }}
              />

              {/* Content */}
              <div className="flex-grow-1">
                {/* Status Row */}
                <div className="d-flex align-items-center mb-2">
                  <div
                    className="me-2 rounded-circle"
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: statusInfo.color,
                    }}
                  />
                  <Badge bg={statusInfo.text} className="text-capitalize">
                    {o.status}
                  </Badge>
                  <span className="ms-auto text-muted small">{formatDate(o.date)}</span>
                </div>

                {/* Order ID */}
                <h6 className="mb-2">Order ID: {o.id || o.orderid}</h6>

                {/* Product Description */}
                <p className="mb-2 text-muted">
                  {o.product} {o.items > 1 ? `& ${o.items - 1} more items` : ''}
                </p>

                {/* Total Price */}
                {/* <strong className="d-block mb-0">₹ {o.total.toLocaleString('en-IN')}</strong> */}
              </div>

              {/* Right Arrow */}
              <div className="ms-4" onClick={() => handleOrderClick(o.orderid)}>
                
                <i className="bi bi-chevron-right fs-3 text-muted"></i> {/* Requires Bootstrap Icons */}
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

export default OrderSection;