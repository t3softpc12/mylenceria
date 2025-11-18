import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { Modal, Button, Accordion } from "react-bootstrap";
import { useCart } from "../context/CartContext"; // Cart Context
import Cart from "../pages/Cart";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductDetail = () => {
  const { productid } = useParams();
  const { parents, productMap } = useProducts();

  // Find the parent product by id
  const product = parents.find((p) => p.productid == productid);

  // Fetch children for this product
  const children = productMap[productid] || [];

  // Extract unique sizes and colors from children products
  const allSizes = [...new Set(children.map((child) => child.size))];
  const allColors = [
    ...new Set(children.map((child) => child.color).filter(Boolean)),
  ];

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null); // State for selected color
  const [showGuide, setShowGuide] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();
  const { cart, removeFromCart, addToCart, removeQuantity } = useCart();
  const [selectedQty, setSelectedQty] = useState(1);
const [mainImage, setMainImage] = useState(null);


const colorHex = {
  "Black": "#000000",
  "White": "#ffffff",
  "Grey": "#A0A0A0",
  "Denim Blue": "#4455EE",
  "Navy": "#001F54",
  "Pink": "#FF7EB9",
};


function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }

  return color;
}

useEffect(() => {
  if (product && product.images) {
    setMainImage(product.images.img1);
  }
}, [product]);

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h3>Product not found</h3>
        <Link to="/" className="btn btn-outline-danger mt-3">
          Go Back
        </Link>
      </div>
    );
  }

  // Add to Cart Function
  const handleAddToCart = () => {
    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor, // Include color in the cart item
      qty: selectedQty,
      selected: true, // Mark the item as selected for cart
      img1: product.images.img1, // Add image as well
    });
    setShowCart(true); // Show cart modal when product is added
  };

  // Cart Modal toggle function
  const toggleCart = () => {
    setShowCart(!showCart);
  };

  function stripHtmlTags(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, ""); // This removes HTML tags
}


const ValidImage = ({ src, onClick, isActive }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <img
      src={src}
      onError={() => setVisible(false)} // <-- hide if image fails to load
      onClick={onClick}
      style={{
        width: "80px",
        height: "90px",
        objectFit: "cover",
        borderRadius: "5px",
        cursor: "pointer",
        border: isActive ? "2px solid #ff4d6d" : "1px solid #ccc",
      }}
      className="img-fluid mb-2"
    />
  );
};


  return (
    <>
      <div className="container-fluid p-3">
        <div className="row g-3" style={{ height: "100vh" }}>
          {/* LEFT — Thumbnails + Main Image */}
          <div className="col-md-7 d-flex pe-5">

            {/* === Thumbnails Column === */}
            <div
              style={{
                width: "90px",
                // height: "100%",
                // overflowY: "scroll",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="me-3"
            >
             {[product.images.img1, product.images.img2, product.images.img3, product.images.img4, product.images.img5]
  .filter((img) => img && typeof img === "string" && img.trim() !== "")
  .map((img, index) => (
    <ValidImage
      key={index}
      src={img}
      isActive={mainImage === img}
      onClick={() => setMainImage(img)}
    />
  ))}

            </div>

          {/* === Main Image Display === */}
          <div className="flex-grow-1 text-center pe-5">
            <img
              src={mainImage}
              alt={product.productname}
              className="img-fluid shadow-sm"
              style={{
                width: "95%",
                maxHeight: "60%",
                objectFit: "cover",
                // borderRadius: "10px",
                // paddingRight: '4vw',
              }}
            />
          </div>
        </div>


          {/* Right: Details */}
         <div
                className="col-md-5 hide-scrollbar"
                style={{
                  // position: "sticky",
                  // top: 0,
                  height: "75vh",
                  overflowY: "auto",
                  paddingRight: "10px"

                }}
              >
            <h3 className="fw-bold text-danger-emphasis mb-1">{product.productname}</h3>
            {/* <p className="text-muted mb-2">{product.category}</p> */}

            <div className="d-flex align-items-center mb-3">
              <h4 className="text-danger me-3 mb-0">{product.special_price}</h4>
              <del className="text-secondary small">{product.customer_mrp}</del>
            </div>

            <p className="text-secondary" style={{ fontSize: "15px" }}>
              {product.description}
            </p>

            {/* === Size Selection === */}
            <div className="mt-4">
              <h6 className="fw-semibold mb-2">Select Size:</h6>
              <div className="d-flex flex-wrap gap-2">
                {allSizes.map((s) => (
                  <button
                    key={s}
                    className={`btn btn-outline-dark px-3 py-1 rounded-5 ${
                      selectedSize === s ? "active" : ""
                    }`}
                    style={{
                      borderColor: selectedSize === s ? "#ff7f73" : "rgba(0,0,0,0.2)",
                      color: selectedSize === s ? "#ff7f73" : "#000",
                    }}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                  
                ))}
                 <Button
                            variant="outline-dark"
                            className="rounded-pill ms-4"
                            onClick={() => setShowGuide(true)}
                        >
                            Size Guide
                        </Button>
              </div>
              
            </div>

            {/* === Color Display === */}
            <div className="mt-4">
              <h6 className="fw-semibold mb-1">Colour:</h6>
              <div className="d-flex align-items-center gap-3 flex-wrap">

  {allColors.map((color) => (
    <div className="color-wrapper" key={color}>
      
      <div
        className="color-circle"
        style={{
          backgroundColor: colorHex[color] || color.toLowerCase(),
          border: selectedColor === color ? "3px solid #E91E63" : "2px solid #ccc",
          transform: selectedColor === color ? "scale(1.15)" : "scale(1)",
        }}
        onClick={() => setSelectedColor(color)}
      ></div>

      <span className="color-tooltip">{color}</span>

    </div>
  ))}

</div>
            </div>

            {/* === Quantity Selection === */}
            <div className="mt-4">
              <h6 className="fw-semibold mb-0">Select Quantity:</h6>
              <div className="d-flex gap-2 align-items-center">
                <button
                  className="btn btn-outline-dark btn-sm pt-1 px-2 rounded-circle fs-5 fw-bold"
                  onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))} // Decrease quantity
                >
                  -
                </button>
                <span className="m-3 fw-bold">{selectedQty}</span>
                <button
                  className="btn btn-outline-dark btn-sm py-1 px-2 rounded-circle fs-5 fw-bold"
                  onClick={() => setSelectedQty(selectedQty + 1)} // Increase quantity
                >
                  +
                </button>
              </div>
            </div>

            {/* === Buttons === */}
            <div className="mt-3 d-flex flex-wrap align-items-center gap-3">
              <button className="btn btn-danger w-75 px-4 py-2 rounded-pill" onClick={handleAddToCart}>
                Add to Cart
              </button>

              <button className=" px-4 py-2 border-0 bg-white">
                <FaRegHeart color="#ff4d6d" size={30} />
              </button>
                        {/* <Button
                            variant="outline-dark"
                            className="rounded-pill"
                            onClick={() => setShowGuide(true)}
                        >
                            Size Guide
                        </Button> */}
            </div>

                    <Link
                        to="/"
                        className="d-inline-block mt-4 text-decoration-none text-dark"
                    >
              ← Back to Shop
            </Link>

            {/* === Accordion Section === */}
            <div className="mt-5 pt-3 border-top">
                        <h6 className="fw-bold mb-3">
                            THIS MODEL IS WEARING: 32B-34B
                        </h6>
              <h6 className="fw-semibold mb-2">Description:</h6>
                        <p
                            className="text-secondary"
                            style={{ fontSize: "15px" }}
                        >
                            Sculpt, smooth, and support — this Mid-Thigh
                            Bodysuit is designed for a flawless fit that feels
                            as good as it looks. With a seamless, no-show finish
                            and all-over shaping, it enhances your natural
                            curves while staying invisible under any outfit.
                            Adjustable straps ensure the perfect fit, while
                            eco-friendly packaging makes it a feel-good choice
                            for you and the planet.
              </p>

              <Accordion flush className="mt-4">
                <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    Product Features
                                </Accordion.Header>
                  <Accordion.Body>
                                    - Seamless design for invisible comfort{" "}
                                    <br />
                    - Adjustable straps for a perfect fit <br />
                                    - Eco-friendly packaging <br />- Designed to
                                    smooth and sculpt curves
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Shipping</Accordion.Header>
                                <Accordion.Body>
                                    Orders are shipped within 2–3 business days.
                                    Free shipping is available on orders above
                                    ₹999.
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Return</Accordion.Header>
                                <Accordion.Body>
                                    Easy 15-day return or exchange policy. The
                                    product must be unused with tags intact.
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="3">
                                <Accordion.Header>Skin Safety</Accordion.Header>
                                <Accordion.Body>
                                    Dermatologically tested materials safe for
                                    daily wear. No harmful dyes or chemicals
                                    used.
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="4">
                                <Accordion.Header>Care Guide</Accordion.Header>
                                <Accordion.Body>
                                    Hand wash only. Do not bleach or tumble dry.
                                    Use mild detergent and dry in shade.
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="5">
                                <Accordion.Header>FAQ's</Accordion.Header>
                                <Accordion.Body>
                                    <b>Q:</b> Is this product true to size?{" "}
                                    <br />
                                    <b>A:</b> Yes, please refer to the size
                                    guide for accuracy. <br />
                                    <br />
                                    <b>Q:</b> Can this be worn under tight
                                    clothing? <br />
                                    <b>A:</b> Absolutely, the seamless design
                                    ensures no visible lines.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

                        <p className="text-muted small mt-4">
                            The product colors displayed on our website may
                            appear slightly different due to individual screen
                            settings and resolution.
                        </p>
            </div>

            <div>
      {/* Stripping HTML from product.make */}
      <div>
        {stripHtmlTags(product.make) || 'No make available'}
      </div>
    </div>

            {/* === Size Guide Modal === */}
                    <Modal
                        show={showGuide}
                        onHide={() => setShowGuide(false)}
                        centered
                        size="md"
                    >
              <Modal.Header closeButton>
                <Modal.Title>Size Guide</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                            <p className="text-secondary mb-3">
                                Measure your underbust and bust size for the
                                most accurate fit:
                            </p>
                            <table className="table table-bordered text-center align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Band Size</th>
                                        <th>Bust (inches)</th>
                                        <th>Suggested Cup</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>32</td>
                                        <td>32–33</td>
                                        <td>B / C</td>
                                    </tr>
                                    <tr>
                                        <td>34</td>
                                        <td>34–35</td>
                                        <td>B / C / D</td>
                                    </tr>
                                    <tr>
                                        <td>36</td>
                                        <td>36–37</td>
                                        <td>B / C / D</td>
                                    </tr>
                                    <tr>
                                        <td>38</td>
                                        <td>38–39</td>
                                        <td>C / D / DD</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="text-muted small mt-3">
                                Tip: If you're between sizes, we recommend
                                choosing the larger cup for comfort.
                            </p>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>

      {/* === Cart Modal === */}
      <Cart showCart={showCart} toggleCart={toggleCart} />
    </>
  );
};

export default ProductDetail;
