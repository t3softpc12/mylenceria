import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();

//   if (wishlist.length === 0) {
//     return (
//       <div className="container py-5 text-center">
//         <h4>Your wishlist is empty 💖</h4>
//         <Link to="/" className="btn btn-outline-danger mt-3">
//           Browse Products
//         </Link>
//       </div>
//     );
//   }

  return (
    <div className="container py-4">
      <h3 className="fw-semibold mb-4 text-danger-emphasis">My Wishlist</h3>
      <div className="row g-4">
        {wishlist.map((item) => (
          <div key={item.id} className="col-md-3 col-6">
            <div className="card border-0 shadow-sm h-100">
              <img
                src={item.image}
                alt={item.name}
                className="card-img-top"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h6 className="fw-semibold">{item.name}</h6>
                <p className="text-danger fw-bold mb-2">{item.price}</p>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => toggleWishlist(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
