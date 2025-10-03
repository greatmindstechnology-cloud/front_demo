import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../PDFGenerate/certificate.css"

export default function CertificatePreview({ studentName, courseName }) {
  const certRef = useRef();

  const downloadPDF = async () => {
    const canvas = await html2canvas(certRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", "a4");
    pdf.addImage(imgData, "PNG", 20, 20, 800, 600);
    pdf.save(`${studentName}_certificate.pdf`);
  };

  return (
    <div>
      <div ref={certRef} className="certificate">
        <h1>Certificate of Completion</h1>
        <p>This is to certify that</p>
        <h2>{studentName}</h2>
        <p>has successfully completed the course</p>
        <h2>{courseName}</h2>
        <p>Date: {new Date().toLocaleDateString()}</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <button className="download-button" onClick={downloadPDF}>
          Download as PDF
        </button>
      </div>
    </div>
  );
}
