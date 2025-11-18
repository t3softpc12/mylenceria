import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useProducts } from "../context/ProductContext";
import "bootstrap/dist/css/bootstrap.min.css";

const FilterSidebar = ({ onFilterChange }) => {
  const [expanded, setExpanded] = useState({
    stock: true,
    price: true,
    color: true,
    compression: true,
    target: true,
    style: true,
    preference: true,
  });

  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2499]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [compressionLevels, setCompressionLevels] = useState([]);
  const [targetAreas, setTargetAreas] = useState([]);
  const [styles, setStyles] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const { availableColors } = useProducts(); 


  const toggleSection = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateFilters = (updates = {}) => {
    onFilterChange({
      priceRange,
      colors: selectedColors,
      compressionLevels,
      targetAreas,
      styles,
      preferences,
      showOutOfStock,
      ...updates,
    });
  };

  // ✅ handle toggle for checkbox lists
  const handleToggle = (item, list, setList, key) => {
    const updated = list.includes(item)
      ? list.filter((i) => i !== item)
      : [...list, item];
    setList(updated);
    updateFilters({ [key]: updated });
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    setPriceRange(newRange);
    updateFilters({ priceRange: newRange });
  };

  const handleColorSelect = (color) => {
    const updated = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    setSelectedColors(updated);
    updateFilters({ colors: updated });
  };

  const handleStockToggle = (value) => {
    setShowOutOfStock(value);
    updateFilters({ showOutOfStock: value });
  };

  return (
    <div className="filter-sidebar border-end p-3" style={{ width: "270px" }}>
      <h5 className="fw-bold mb-3">Filters</h5>

      {/* Out of Stock */}
      <div className="mb-3">
        <div
          className="d-flex justify-content-between align-items-center"
          onClick={() => toggleSection("stock")}
        >
          <strong>Stock</strong>
          {expanded.stock ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expanded.stock && (
          <div className="d-flex gap-2 mt-2">
            <button
              className={`btn btn-sm ${
                showOutOfStock ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => handleStockToggle(true)}
            >
              Show Out of Stock
            </button>
            <button
              className={`btn btn-sm ${
                !showOutOfStock ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => handleStockToggle(false)}
            >
              Hide
            </button>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mb-3">
        <div
          className="d-flex justify-content-between align-items-center"
          onClick={() => toggleSection("price")}
        >
          <strong>Price</strong>
          {expanded.price ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expanded.price && (
          <>
            <div className="d-flex gap-2 mt-2">
              <input
                type="number"
                className="form-control form-control-sm"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
              />
              <input
                type="number"
                className="form-control form-control-sm"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
              />
            </div>
            <input
              type="range"
              className="form-range mt-2"
              min="0"
              max="2499"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
            />
            <input
              type="range"
              className="form-range"
              min="0"
              max="2499"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
            />
          </>
        )}
      </div>

      {/* Color */}
      <div className="mb-3">
        <div
          className="d-flex justify-content-between align-items-center"
          onClick={() => toggleSection("color")}
        >
          <strong>Color</strong>
          {expanded.color ? <FaChevronUp /> : <FaChevronDown />}
        </div>
       {expanded.color && (
        <div className="d-flex flex-wrap gap-2 mt-2">
          {availableColors.map((color) => (

            // console.log("colorssss from filter",availableColors),
            <button
              key={color}
              className={`btn btn-sm ${
                selectedColors.includes(color)
                  ? "btn-danger"
                  : "btn-outline-danger"
              }`}
              onClick={() => handleColorSelect(color)}
            >
              {color}
            </button>
          ))}
        </div>
      )}
      </div>

      {/* Compression Level */}
      <div className="mb-3">
        <div
          className="d-flex justify-content-between align-items-center"
          onClick={() => toggleSection("compression")}
        >
          <strong>Compression Level</strong>
          {expanded.compression ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expanded.compression && (
          <div className="mt-2">
            {["Light", "Medium", "High"].map((level) => (
              <div className="form-check" key={level}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={compressionLevels.includes(level)}
                  onChange={() =>
                    handleToggle(level, compressionLevels, setCompressionLevels, "compressionLevels")
                  }
                />
                <label className="form-check-label">{level}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Target Area */}
      <div className="mb-3">
        <div
          className="d-flex justify-content-between align-items-center"
          onClick={() => toggleSection("target")}
        >
          <strong>Target Area</strong>
          {expanded.target ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expanded.target && (
          <div className="mt-2">
            {[
              "Bust",
              "Waist",
              "Tummy",
              "Thigh",
              "Butt",
              "All day bra",
            ].map((t) => (
              <div className="form-check" key={t}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={targetAreas.includes(t)}
                  onChange={() =>
                    handleToggle(t, targetAreas, setTargetAreas, "targetAreas")
                  }
                />
                <label className="form-check-label">{t}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Style */}
      <div className="mb-3">
        <div
          className="d-flex justify-content-between align-items-center"
          onClick={() => toggleSection("style")}
        >
          <strong>Style</strong>
          {expanded.style ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expanded.style && (
          <div className="mt-2">
            {["T-Shirt Bra", "Bralette", "Sports Bra", "Cotton Bra", "Lace Bra"].map((s) => (
              <div className="form-check" key={s}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={styles.includes(s)}
                  onChange={() => handleToggle(s, styles, setStyles, "styles")}
                />
                <label className="form-check-label">{s}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preference */}
      <div className="mb-3">
        <div
          className="d-flex justify-content-between align-items-center"
          onClick={() => toggleSection("preference")}
        >
          <strong>Preference</strong>
          {expanded.preference ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {expanded.preference && (
          <div className="mt-2">
            {["Padded", "Non Padded", "Wired", "Non Wired"].map((pref) => (
              <div className="form-check" key={pref}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={preferences.includes(pref)}
                  onChange={() =>
                    handleToggle(pref, preferences, setPreferences, "preferences")
                  }
                />
                <label className="form-check-label">{pref}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
