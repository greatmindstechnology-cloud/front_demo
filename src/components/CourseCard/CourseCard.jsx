import { Link } from "react-router-dom";
import "./CourseCard.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const CourseCard = ({ course }) => {
  const location = useLocation();
  const [status, setStatus] = useState(course.status || "");
  const [loading, setLoading] = useState(false);

  // Fetch latest status from API
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8000/course_gmt/course/details/?course_id=${course.id}`, {
          method: "GET",
        });
        const data = await res.json();
        if (data && data.status) setStatus(data.status);
      } catch (e) {
        // handle error silently
      }
    };
    fetchStatus();
  }, [course.id]);

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("course_id", course.id);
    formData.append("course_title", course.title);
    formData.append("status", newStatus);
    console.log("Updating status for course:", course.id, "to", newStatus, "Title of course:", course.title);
    try {
      await fetch("http://localhost:8000/course_gmt/update-course-status/", {
        method: "PUT",
        body: formData
      });
      setStatus(newStatus);
    } catch (e) {
      // handle error silently
    }
    setLoading(false);
  };

  const getStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < fullStars; i++) stars.push("★");
    if (halfStar) stars.push("☆");
    while (stars.length < 5) stars.push("☆");
    return stars.join(" ");
  };

  const isAdmin = location.pathname.includes("/admin");
  const isSAdmin = location.pathname.includes("/sadmin");

  return (
    <div className="course-card">
      <img
        src={"http://localhost:8000" + course.image}
        alt={course.title}
        className="course-img"
        style={{ width: "250px", height: "250px", objectFit: "cover" }}
      />
      <h3>{course.title}</h3>
      <p>Author: {course.author}</p>

      <p className="rating" style={{ fontSize: "1.1rem" }}>
        <strong>{course.rating}</strong>{" "}
        <span className="stars">{getStars(course.rating)}</span>
      </p>

      <p className="price">Price: ₹{course.price}</p>

      {isAdmin || isSAdmin ? (
        <div className="admin-actions" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" }}>
          <p style={{ fontSize: "2rem" }}>
            Status: <strong>{status === "approved" ? "Approved" : status === "waiting" ? "Waiting" : status === "rejected" ? "Rejected" : status}</strong>
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button
              className="approve-btn"
              style={{ backgroundColor: "#28a745", color: "#fff", padding: "1rem", width: "8rem" }}
              disabled={loading || status === "approved"}
              onClick={() => handleStatusUpdate("approved")}
            >
              Approve
            </button>
            <button
              className="reject-btn"
              style={{ backgroundColor: "#dc3545", color: "#fff", padding: "1rem", width: "8rem" }}
              disabled={loading || status === "rejected"}
              onClick={() => handleStatusUpdate("rejected")}
            >
              Reject
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link to={`/course/${course.id}`} className="course-link">
            <button className="cart-btn">Add to Cart</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CourseCard;