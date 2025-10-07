import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import "../PDFGenerate/certificate.css";
import "../PDFGenerate/certificate.css"
export default function Certificate({
  studentName,
  courseName,
  trainerName,
  date,
}) {
  const certRef = useRef();

  const handleDownload = async () => {
    const canvas = await html2canvas(certRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", "a4");
    pdf.addImage(imgData, "PNG", 20, 20, 800, 600);
    pdf.save(`${studentName}_certificate.pdf`);
  };

  return (
    <>
      <div ref={certRef} className="certificate-wrapper">
        <div className="text-field awarded-to">{studentName}</div>
        <div className="text-field description">
          This certificate is awarded to {studentName} for successfully
          completing the {courseName} course. Awarded on {date}.
        </div>
        <div className="text-field date">{date}</div>
        <div className="text-field trainer">{trainerName}</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <button className="download-button" onClick={handleDownload}>
          Download as PDF
        </button>
      </div>
    </>
  );
}
