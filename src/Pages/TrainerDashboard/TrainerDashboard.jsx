import React, { useState, useEffect } from "react";
import CourseCard from "../../components/CourseCard/CourseCard";
import "./TrainerDashboard.css";
import { useNavigate } from "react-router-dom";

const TrainerDashboard = () => {
  const [trainer, setTrainer] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = (event) => {
    console.log("handleLogout triggered");
    event?.preventDefault();
    event?.stopPropagation();
    console.log("Logging out, clearing storage");
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log("Storage cleared");
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
    navigate("/Login", { replace: true });
    console.log("Navigated to /Login");
  };

  useEffect(() => {
    const BASE_URL = "http://localhost:8000";

    const fetchData = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        console.log("Trainer email from localStorage:", email);
        const trainerId = localStorage.getItem("vendorId");
        if (!email || !trainerId) {
          throw new Error("Trainer email or ID not found in localStorage");
        }

        // Fetch trainer data by email
        console.log("Fetching trainer data for email:", email);
        const trainerResponse = await fetch(
          `${BASE_URL}/admin_gmt/trainer/?email=${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Raw Response:", trainerResponse);

        if (!trainerResponse.ok) {
          throw new Error(
            `Failed to fetch trainer data: ${trainerResponse.status} ${trainerResponse.statusText}`
          );
        }

        const trainerData = await trainerResponse.json();
        console.log("Parsed Trainer Data:", trainerData);

        if (trainerData.status !== "success") {
          throw new Error(
            "Failed to fetch trainer data: Invalid response status"
          );
        }

        const fetchedTrainer = trainerData.data;
        if (!fetchedTrainer || typeof fetchedTrainer !== "object") {
          throw new Error("No trainer data returned from the backend");
        }

        // Map trainer data
        const mappedTrainer = {
          ...fetchedTrainer,
          experience: fetchedTrainer.total_experience_years
            ? `${fetchedTrainer.total_experience_years} years`
            : "Not specified",
          courses: fetchedTrainer.courses_count || 0,
          profilePicture: fetchedTrainer.profile_picture
            ? `${BASE_URL}${fetchedTrainer.profile_picture}`
            : null,
          stepsCompleted: fetchedTrainer.steps_completed || 1, // Default to 1 if not provided
          totalSteps: fetchedTrainer.total_steps || 4, // Default to 4 if not provided
          progressPercentage: fetchedTrainer.progress_percentage || 25, // Default to 25 if not provided
        };

        // Fetch courses by trainer ID
        console.log("Fetching trainer and course data for ID:", trainerId);
        const coursesResponse = await fetch(
          `${BASE_URL}/trainer_gmt/trainer/courses/?trainer_id=${trainerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Raw Response:", coursesResponse);

        if (!coursesResponse.ok) {
          throw new Error(
            `Failed to fetch courses: ${coursesResponse.status} ${coursesResponse.statusText}`
          );
        }

        const coursesData = await coursesResponse.json();
        console.log("Parsed Courses Data:", coursesData);

        if (!coursesData.courses) {
          throw new Error("Invalid courses response: Missing courses data");
        }

        // Map course data for CourseCard
        const mappedCourses = coursesData.courses.map((course) => ({
          id: course.id,
          title: course.title,
          author: `${coursesData.trainer.first_name} ${coursesData.trainer.last_name}`,
          rating: course.rating || 0,
          price: course.price || 0,
          image: course.image || "https://placehold.co/200x200",
          students: course.students_enrolled || 0,
        }));

        setTrainer(mappedTrainer);
        setCourses(mappedCourses);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!trainer) {
    return <div className="loading">Loading...</div>;
  }

  const totalStudents = courses.reduce(
    (sum, course) => sum + (course.students || 0),
    0
  );

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div>
          <p className="greeting">Good Morning</p>
          <h1 className="title" onClick={handleLogout}>
            {trainer.first_name} {trainer.last_name}'s Dashboard
          </h1>
        </div>
        <div className="header-right">
          <input type="text" placeholder="Search" className="search-input" />
        </div>
      </header>

      {/* Stats Section */}
      <div className="stats">
        <div className="stat-card">
          <span className="stat-icon enrolled-icon">📚</span>
          <div>
            <p className="stat-value">{courses.length}</p>
            <p className="stat-label">Enrolled Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon active-icon">📖</span>
          <div>
            <p className="stat-value">{trainer.courses || 0}</p>
            <p className="stat-label">Active Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon instructor-icon">👩‍🏫</span>
          <div>
            <p className="stat-value">0</p>
            <p className="stat-label">Online Course</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon students-icon">👥</span>
          <div>
            <p className="stat-value">{totalStudents.toLocaleString()}</p>
            <p className="stat-label">Students</p>
          </div>
        </div>
      </div>

      {/* Trainer Profile */}
      <div className="trainer-profile">
        <div className="trainer-info">
          <img
            className="trainer-pic"
            src={trainer?.profilePicture || "https://placehold.co/110x110"}
            alt="Trainer"
            onError={(e) => {
              e.target.src = "https://placehold.co/110x110";
            }}
          />
          <div>
            <h2 className="trainer-name">
              {trainer.first_name} {trainer.last_name}
            </h2>
            <p className="trainer-email">{trainer.email}</p>
            <p className="trainer-experience">{trainer.experience}</p>
          </div>
        </div>
        <div className="trainer-actions">
          <div className="progress-container">
            <span className="progress-label">
              {trainer.stepsCompleted}/{trainer.totalSteps} Steps
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${trainer.progressPercentage}%` }}
              ></div>
            </div>
            <span className="progress-percentage">
              {trainer.progressPercentage}% Completed
            </span>
          </div>
          <button
            onClick={() => navigate("/dashboard/trainer/trainereditprofile")}
            className="edit-btn"
          >
            Edit Biography
          </button>
        </div>
      </div>

      {/* Courses Section */}
      <div className="courses">
        <h2 className="courses-title">
          {trainer.first_name} Courses (
          {courses.length.toString().padStart(2, "0")})
        </h2>
        <div className="course-grid">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard
                key={course.id}
                course={{
                  id: course.id,
                  title: course.title,
                  author: course.author,
                  rating: course.rating,
                  price: course.price,
                  image: course.image,
                  students: course.students,
                }}
              />
            ))
          ) : (
            <p>No courses available for this trainer.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
