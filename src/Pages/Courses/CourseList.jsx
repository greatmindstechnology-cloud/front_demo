import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  TextField,
} from "@mui/material";
import Footer from "../../components/Footer/Footer";
import CourseCard from "../../components/CourseCard/CourseCard";
import "./CourseList.css";

// ✅ CATEGORY MAPPING
const categoryMap = {
  "Java Full Stack Developer": ["HTML", "CSS", "JavaScript", "React", "Java", "SQL"],
  "Python Full Stack Developer": ["HTML", "CSS", "JavaScript", "Python", "Django", "PostgreSQL"],
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Vue"],
  "Backend Developer": ["Node.js", "Express", "MongoDB", "SQL", "Java", "Python"],
};

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [titleFilterText, setTitleFilterText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    enrolledCourses: 0,
    activeCourses: 0,
    completedCourses: 0,
    courseInstructors: 0,
  });

  const navigate = useNavigate();
  const { query } = useParams();

  useEffect(() => {
    const DEFAULT_IMAGE = "https://via.placeholder.com/250?text=No+Image";
    const BASE_URL = "https://backend-demo-esqk.onrender.com";
    const validImageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    const fetchCourses = async () => {
      try {
        const res = await fetch(`${BASE_URL}/student_gmt/all-courses/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status} ${res.statusText}`);

        const data = await res.json();
        const mappedCourses = (data.courses || [])
          .filter((course) => course.status === "approved")
          .map((course) => {
            let imageUrl = DEFAULT_IMAGE;
            if (course.course_image) {
              const cleanPath = course.course_image.replace(/^\/+/, "");
              const isValidImage = validImageExtensions.some((ext) =>
                cleanPath.toLowerCase().endsWith(ext)
              );
              if (isValidImage) {
                imageUrl = `${BASE_URL}/${cleanPath}`;
              }
            }
            return {
              id: course.course_id,
              title: course.course_title,
              image: imageUrl,
              price: course.course_price,
              description: course.course_description,
              rating: course.course_rating,
            };
          });

        setCourses(mappedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err.message);
        setCourses([]);
      }
    };

    const fetchDashboardStats = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/dashboard-stats/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch dashboard stats");
        const data = await res.json();
        setDashboardStats(data || {});
      } catch (err) {
        console.error("Error fetching dashboard stats:", err.message);
      }
    };

    const fetchUserData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/user-profile/`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user profile:", err.message);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.allSettled([fetchUserData(), fetchCourses(), fetchDashboardStats()]);
      setLoading(false);
    };

    fetchAll();
  }, []);

  useEffect(() => {
    if (query) {
      setSearchText(query);
      console.log(query);
      alert(`Search query: ${query}`);
    }
  }, [query]);

  const handleCourseClick = (courseId) => {
    navigate(`/dashboard/course/${courseId}`);
  };

  const matchedCourseTitles = new Set();
  selectedCategories.forEach((category) => {
    const related = categoryMap[category];
    if (related) related.forEach((title) => matchedCourseTitles.add(title.toLowerCase()));
  });

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || matchedCourseTitles.has(course.title.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const allCategories = Object.keys(categoryMap);
  const filteredCategories = allCategories.filter((cat) =>
    cat.toLowerCase().includes(titleFilterText.toLowerCase())
  );

  return (
    <div>
      <div className="coure-list-parent">
        <div className="course-list-container">
          <h1>
            <span>Course List</span>
          </h1>
          <p className="text-gray-500">
            <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/dashboard/")}>
              Home /{" "}
            </span>
            <span> Course List</span>
          </p>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="course-grid">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div key={course.id} onClick={() => handleCourseClick(course.id)}>
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <p>No courses found.</p>
            )}
          </div>
        </div>

        <div className="filter-section-parent">
          <h1>Filter</h1>
          <div className="filter-section-child">
            <TextField
              label="Search Categories"
              variant="outlined"
              size="small"
              fullWidth
              onChange={(e) => setTitleFilterText(e.target.value)}
              style={{ marginBottom: 10 }}
            />

            <List style={{ maxHeight: 250, overflowY: "auto" }}>
              {filteredCategories.map((category) => (
                <ListItem key={category} disablePadding>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onChange={() => {
                          setSelectedCategories((prev) =>
                            prev.includes(category)
                              ? prev.filter((t) => t !== category)
                              : [...prev, category]
                          );
                        }}
                      />
                    }
                    label={category}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseList;
