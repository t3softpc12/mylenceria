// src/components/SizeGuide.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Spinner, Table } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";

const SizeGuide = ({ category, show, onHide }) => {
  const [sizeData, setSizeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const drawerRef = useRef(null);

  // === CONFIG: Define columns per category ===
  const categoryConfig = {
    Bras: {
      extraColumns: [
        { key: "bra_size", label: "Bra Size" },
      ],
      mainColumns: [
        { key: "under_bust", label: "Under Bust (in)" },
        { key: "over_bust", label: "Over Bust (in)" },
      ],
      showHowToMeasure: true,
    },
    Panties: {
      extraColumns: [],
      mainColumns: [
        { key: "hip", label: "Hip (in)" },
      ],
      showHowToMeasure: false,
    },
    Nightwear: {
      extraColumns: [{ key: "uk_size", label: "UK Size" }],
      mainColumns: [
        { key: "bust", label: "Bust (in)" },
        { key: "waist", label: "Waist (in)" },
        { key: "hip", label: "Hip (in)" },
      ],
      showHowToMeasure: false,
    },
    Shapewear: {
      extraColumns: [],
      mainColumns: [
        { key: "bust", label: "Bust (in)" },
        { key: "waist", label: "Waist (in)" },
        { key: "hip", label: "Hip (in)" },
      ],
      showHowToMeasure: false,
    },
    // Add more categories easily here
  };

  const normalizedCategory = category?.trim();
  const config = categoryConfig[normalizedCategory] || {
    extraColumns: [],
    mainColumns: [{ key: "bust", label: "Measurement (in)" }], // fallback
    showHowToMeasure: false,
  };

  useEffect(() => {
    if (!show || !normalizedCategory) return;

    const fetchSizeGuide = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SIZE_GUIDE}?category=${encodeURIComponent(normalizedCategory)}`
        );

        if (res.data.success && Array.isArray(res.data.sizes)) {
          setSizeData(res.data.sizes);
        } else {
          setError("No size guide available for this category.");
        }
      } catch (err) {
        console.error("Error fetching size guide:", err);
        setError("Failed to load size guide. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSizeGuide();
  }, [normalizedCategory, show]);

  // Slide animation
  useEffect(() => {
    if (drawerRef.current) {
      drawerRef.current.style.transform = show ? "translateX(0)" : "translateX(100%)";
    }
  }, [show]);

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: 1040 }}
        onClick={onHide}
      />

      {/* Side Drawer */}
      <div
        ref={drawerRef}
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg overflow-auto"
        style={{
          width: "420px",
          maxWidth: "90vw",
          zIndex: 1050,
          transition: "transform 0.4s ease-in-out",
          transform: "translateX(100%)",
        }}
      >
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Size Guide - {normalizedCategory}</h5>
          <Button variant="link" className="text-dark p-0" onClick={onHide}>
            <FaTimes size={24} />
          </Button>
        </div>

        <div className="p-4">
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="dark" />
              <p className="mt-3">Loading size guide...</p>
            </div>
          )}

          {error && <div className="alert alert-danger text-center">{error}</div>}

          {!loading && !error && sizeData.length === 0 && (
            <p className="text-center text-muted">
              No size guide available for this category.
            </p>
          )}

          {!loading && !error && sizeData.length > 0 && (
            <>
              <div className="table-responsive mb-4">
                <Table striped bordered hover className="text-center small">
                  <thead className="table-dark">
                    <tr>
                      <th>Size</th>
                      {config.extraColumns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                      {config.mainColumns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.map((row, idx) => (
                      <tr key={idx}>
                        <td><strong>{row.size}</strong></td>
                        {config.extraColumns.map((col) => (
                          <td key={col.key}>{row[col.key] || "-"}</td>
                        ))}
                        {config.mainColumns.map((col) => (
                          <td key={col.key}>{row[col.key] || "-"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {config.showHowToMeasure && (
                <div className="p-3 bg-light rounded small">
                  <strong>How to Measure:</strong>
                  <ul className="mt-2 mb-0">
                    <li><strong>Under Bust:</strong> Measure snugly around ribcage, just below bust</li>
                    <li><strong>Over Bust:</strong> Measure around the fullest part of your bust</li>
                  </ul>
                  <p className="mt-2 mb-0">
                    Alpha sizes (XS, S, M...) are approximate equivalents for comfort bras.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SizeGuide;