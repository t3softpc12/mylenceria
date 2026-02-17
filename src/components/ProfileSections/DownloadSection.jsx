import React from "react";
import { Button } from "react-bootstrap";

const DownloadSection = () => {
  const downloadableProducts = [
    {
      id: "DIGI-204",
      name: "Size & Fit Guide PDF",
      date: "2024-08-10",
      size: "2.3 MB",
    },
    {
      id: "DIGI-187",
      name: "Lingerie Care Handbook",
      date: "2024-07-22",
      size: "3.8 MB",
    },
  ];

  return (
    <>
      <h3>Downloadable Products</h3>

      {downloadableProducts.map((item) => (
        <div
          key={item.id}
          className="mb-3 shadow rounded p-3"
        >
          <div className="d-flex justify-content-between">
            <strong>{item.name}</strong>
            <Button variant='dark' size="sm" >
              Download
            </Button>
          </div>
          <p className="text-muted mb-1">{item.size}</p>
          <small className="text-muted">{item.date}</small>
        </div>
      ))}
    </>
  );
};

export default DownloadSection;
