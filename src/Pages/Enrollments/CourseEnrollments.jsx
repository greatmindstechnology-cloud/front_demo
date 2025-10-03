import React, { useState } from "react";

const styles = {
  container: {
    padding: "1rem",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "18px",
  },
  card: {
    backgroundColor: "#004aad",
    color: "white",
    padding: "28px",
    borderRadius: "20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  cardHover: {
    transform: "scale(1.05)",
    boxShadow: "0 0 40px rgba(12, 104, 224, 0.96)",
  },
  count: {
    fontSize: "36px",
    fontWeight: "bold",
    margin: "12px 0 6px",
  },
  label: {
    fontSize: "14px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: "24px",
    borderRadius: "10px",
    width: "500px",
    maxWidth: "90%",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thtd: {
    textAlign: "left",
    color: "rgb(0, 0, 0)",
    padding: "8px",
    borderBottom: "1px solid #ccc",
  },
  progressBar: {
    position: "relative",
    height: "20px",
    background: "#e0e0e0",
    borderRadius: "10px",
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    background: "#004aad",
  },
  progressText: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "12px",
    color: "white",
  },
  closeBtn: {
    marginTop: "20px",
    padding: "8px 16px",
    background: "#004aad",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  h3: {
    fontSize: "1.20rem",
    fontWeight: "Bold"
  },
};

const CourseEnrollments = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const courses = [
    { name: "Java CORE", count: 56 },
    { name: "MERN Development", count: 34 },
    { name: "Flutter", count: 32 },
    { name: "SQL - Beginner", count: 32 },
    { name: "Python Basics", count: 40 },
    { name: "React Native", count: 28 },
    { name: "C++ Programming", count: 35 },
    { name: "Data Science", count: 30 },
  ];

  const students = [
    { name: "Alice", progress: 90 },
    { name: "Bob", progress: 75 },
    { name: "Charlie", progress: 60 },
    { name: "David", progress: 50 },
    { name: "Eve", progress: 40 },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Course Enrollments</h2>

      <div style={styles.grid}>
        {courses.map((course, index) => (
          <div
            key={index}
            style={
              hoveredCard === index
                ? { ...styles.card, ...styles.cardHover }
                : styles.card
            }
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setSelectedCourse(course)}
          >
            <h3 style={styles.h3}>{course.name}</h3>
            <p style={styles.count}>{course.count}</p>
            <p style={styles.label}>students</p>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedCourse(null)}
        >
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{color: "Black"}}>{selectedCourse.name} - Enrolled Students</h3>
            <table style={styles.table}>
              <thead>
                <tr>    
                  <th style={styles.thtd}>Name</th>
                  <th style={styles.thtd}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i}>
                    <td style={styles.thtd}>{s.name}</td>
                    <td style={styles.thtd}>
                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progress,
                            width: `${s.progress}%`,
                          }}
                        />
                        <span style={styles.progressText}>{s.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              style={styles.closeBtn}
              onClick={() => setSelectedCourse(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseEnrollments;
