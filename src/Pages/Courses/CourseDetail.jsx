// src/components/CourseDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import "./CourseDetails.css";
import axios from "axios";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/course_gmt/course/details/?course_id=${id}`)
      .then((res) => {
        setCourse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching course:", err);
        setError(err);
        setLoading(false);
      });
  }, [id]);

  const handleEnroll = () => {
    navigate(`/dashboard/course/${id}/video`);
  };

  const handleProjectSubmit = () => {
    localStorage.setItem("courseId", id);
    navigate(`/dashboard/ProjectList`); // Changed to match the route in App.jsx
  };

  const handleTaskSubmit = () => {
    localStorage.setItem("courseId", id);
    navigate(`/dashboard/GetTasks`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading course details.</p>;
  if (!course) return <p>Loading...</p>;

  return (
    <div className="course-details">
      <main className="main-container">
        <div className="left-panel">
          <h1 className="course-title">{course.course_title}</h1>
          <p className="course-subtitle">{course.about_course}</p>
          <p className="rating">
            <span className="stars">⭐ {course.course_rating}</span> (
            {course.total_students_enrolled} ratings) ·{" "}
            {course.total_students_enrolled} students ·{" "}
            <span className="instructor">
              by {course.course_author || "Admin"}
            </span>
          </p>

          <section className="course-structure">
            <h2 style={{ marginBottom: "5px" }}>Course Structure</h2>
            {course.sections && course.sections.length > 0 ? (
              course.sections.map((section, sIndex) => (
                <div key={section.id} className="section-block">
                  <h3>
                    <span className="section-icon">🔵</span>{" "}
                    {section.section_title}
                    <div className="lecture-count">
                      {section.lectures.length} lectures •{" "}
                      {section.lectures.reduce(
                        (total, lecture) =>
                          total + parseDuration(lecture.duration),
                        0
                      )}
                      m
                    </div>
                  </h3>
                  {section.lectures.length > 0 ? (
                    <ul className="lecture-list">
                      {section.lectures.map((lecture) => (
                        <li key={lecture.id}>
                          <span className="lecture-icon">📜</span>{" "}
                          {lecture.title} — <em>{lecture.duration}</em>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No lectures available.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No course sections available.</p>
            )}
          </section>

          <section className="requirements">
            <h2>Specifications</h2>
            <p>{course.course_specification}</p>
          </section>

          <section className="description">
            <h2>Course Description</h2>
            <p>{course.course_description}</p>
          </section>
        </div>

        <aside className="right-card">
          <img
            className="preview-image"
            src={course.course_image}
            alt="Course Preview"
          />
          <p className="offer">5 days left at this price!</p>
          <div className="price-tag">
            <span className="discount-price">
              ₹{parseFloat(course.course_price)}
            </span>
            <span className="original-price">
              ₹{parseFloat(course.course_price) * 2}
            </span>
            <span className="offer-tag">50% off</span>
          </div>
          <p className="course-meta">
            <span className="meta-icon">⭐</span>
            {course.course_rating}
            <span className="meta-icon">⏱️</span> 30 hours{" "}
            <span className="meta-icon">📚</span>{" "}
            {course.sections.reduce(
              (total, section) => total + section.lectures.length,
              0
            )}{" "}
            lessons
          </p>
          <button className="enroll-btn" onClick={handleEnroll}>
            Enroll Now
          </button>

          <div className="features">
            <h3>What's in the course?</h3>
            <p>✅ Life time access with free updates</p>
            <p>✅ Step-by-step, hands-on project guidance</p>
            <p>✅ Project-based hands-on learning</p>
            <p>✅ Downloadable resources</p>
            <p>✅ Certificate of completion</p>
          </div>
        </aside>
      </main>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <button
          className="enroll-btn"
          onClick={handleProjectSubmit}
          style={{ backgroundColor: "#007bff", marginRight: "10px" }}
        >
          Submit Project
        </button>
        <button
          className="enroll-btn"
          onClick={handleTaskSubmit}
          style={{ backgroundColor: "#28a745" }}
        >
          Submit Task
        </button>
      </div>
      <Footer />
    </div>
  );
};

// Helper function to parse duration (e.g., "0:03:00" to minutes)
const parseDuration = (duration) => {
  const [hours, minutes] = duration.split(":").map(Number);
  return hours * 60 + minutes;
};

export default CourseDetails;