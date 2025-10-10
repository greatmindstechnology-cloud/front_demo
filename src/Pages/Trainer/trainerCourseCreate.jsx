import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StarRating from "../../components/LandingPage/StarRating";

const CreateCourse = () => {
  const [trainerId, setTrainerId] = useState(null);
  const [createdCourseId, setCreatedCourseId] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [isDraft, setIsDraft] = useState(false);
  const navigate = useNavigate();

  const [courseFormData, setCourseFormData] = useState({
    author_name: "",
    course_title: "",
    course_price: "",
    course_rating: "",
    course_description: "",
    about_course: "",
    course_specification: "",
    preknowledge: "",
    why_this_course: "",
    course_image: null,
  });

  const [sectionFormData, setSectionFormData] = useState({ section_title: "" });

  const [lectureFormData, setLectureFormData] = useState({
    title: "",
    duration: "00:00:00",
    active: false,
    ppt_file: null,
    pdf_file: null,
    video_file: null,
  });

  useEffect(() => {
    const id = localStorage.getItem("vendorId") || "";
    if (!id) {
      setError("Trainer ID not found. Please log in.");
      navigate("/login", { replace: true });
    } else {
      setTrainerId(id);
    }
  }, [navigate]);

  const handleCourseInputChange = (e) => {
    const { name, value, files } = e.target;
    setCourseFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSectionInputChange = (e) => {
    const { name, value } = e.target;
    setSectionFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLectureInputChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setLectureFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const requiredFields = [
      "author_name",
      "course_title",
      "course_price",
      "course_rating",
      "course_description",
      "about_course",
      "course_specification",
      "preknowledge",
      "why_this_course",
    ];
    for (const field of requiredFields) {
      if (!courseFormData[field]) {
        setError(
          `${field.replace("_", " ").replace("course ", "")} is required.`
        );
        setIsLoading(false);
        return;
      }
    }

    if (parseFloat(courseFormData.course_price) < 0) {
      setError("Price cannot be negative.");
      setIsLoading(false);
      return;
    }

    const rating = parseFloat(courseFormData.course_rating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      setError("Rating must be a number between 0 and 5.");
      setIsLoading(false);
      return;
    }

    if (courseFormData.course_image) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(courseFormData.course_image.type)) {
        setError("Course image must be a JPEG, PNG, or GIF file.");
        setIsLoading(false);
        return;
      }
      if (courseFormData.course_image.size > 5 * 1024 * 1024) {
        setError("Course image size must be less than 5MB.");
        setIsLoading(false);
        return;
      }
    }

    const data = new FormData();
    Object.entries(courseFormData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value);
      }
    });
    data.append("is_draft", isDraft);

    try {
      const response = await axios.post(
        `https://backend-demo-esqk.onrender.com/trainer_gmt/courses/create/?trainer_id=${trainerId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const courseId = response.data.course_id || response.data.id;
      if (!courseId) {
        setError("Course created, but ID not returned by server.");
        setIsLoading(false);
        return;
      }

      setCreatedCourseId(courseId);
      setSuccess(
        `Course "${courseFormData.course_title}" ${isDraft ? "saved as draft" : "created"} successfully!`
      );

      setSections((prev) => [
        ...prev,
        {
          type: "course",
          id: courseId,
          author_name: courseFormData.author_name,
          title: courseFormData.course_title,
          price: courseFormData.course_price,
          rating: courseFormData.course_rating,
          description: courseFormData.course_description,
          about_course: courseFormData.about_course,
          course_specification: courseFormData.course_specification,
          preknowledge: courseFormData.preknowledge,
          why_this_course: courseFormData.why_this_course,
          course_image: courseFormData.course_image
            ? courseFormData.course_image.name
            : null,
          sections: [],
        },
      ]);

      setCourseFormData({
        author_name: "",
        course_title: "",
        course_price: "",
        course_rating: "",
        course_description: "",
        about_course: "",
        course_specification: "",
        preknowledge: "",
        why_this_course: "",
        course_image: null,
      });

      if (!isDraft) setActiveTab("section");
      else setTimeout(() => navigate("/dashboard/trainer"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Course creation failed.");
      console.error("Course API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!sectionFormData.section_title) {
      setError("Section title is required.");
      setIsLoading(false);
      return;
    }

    if (!createdCourseId) {
      setError("Course must be created first.");
      setIsLoading(false);
      return;
    }

    const data = {
      section_title: sectionFormData.section_title,
      course: createdCourseId,
      is_draft: isDraft,
    };

    try {
      const response = await axios.post(
        `https://backend-demo-esqk.onrender.com/trainer_gmt/courses/sections/?course_id=${createdCourseId}`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      const sectionId = response.data.section_id || response.data.id;
      if (!sectionId) {
        setError("Section created, but ID not returned by server.");
        setIsLoading(false);
        return;
      }

      setSections((prev) => {
        const courseExists = prev.find(
          (item) => item.id === createdCourseId && item.type === "course"
        );
        if (courseExists) {
          return prev.map((item) =>
            item.id === createdCourseId && item.type === "course"
              ? {
                  ...item,
                  sections: [
                    ...item.sections,
                    {
                      type: "section",
                      id: sectionId,
                      section_title: sectionFormData.section_title,
                      lectures: [],
                    },
                  ],
                }
              : item
          );
        } else {
          return [
            ...prev,
            {
              type: "course",
              id: createdCourseId,
              author_name: courseFormData.author_name || "Unknown Author",
              title: courseFormData.course_title || "Untitled Course",
              price: courseFormData.course_price || 0,
              rating: courseFormData.course_rating || 0,
              description: courseFormData.course_description || "",
              about_course: courseFormData.about_course || "",
              course_specification: courseFormData.course_specification || "",
              preknowledge: courseFormData.preknowledge || "",
              why_this_course: courseFormData.why_this_course || "",
              course_image: courseFormData.course_image
                ? courseFormData.course_image.name
                : null,
              sections: [
                {
                  type: "section",
                  id: sectionId,
                  section_title: sectionFormData.section_title,
                  lectures: [],
                },
              ],
            },
          ];
        }
      });

      setSelectedSectionId(sectionId);
      setSuccess(
        `Section "${sectionFormData.section_title}" added successfully!`
      );
      setSectionFormData({ section_title: "" });
      setActiveTab("lecture");
    } catch (err) {
      setError(err.response?.data?.error || "Section creation failed.");
      console.error("Section API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLectureSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!lectureFormData.title) {
      setError("Title is required.");
      setIsLoading(false);
      return;
    }
    if (!lectureFormData.duration.match(/^\d{2}:\d{2}:\d{2}$/)) {
      setError("Duration must be in HH:MM:SS format.");
      setIsLoading(false);
      return;
    }
    if (!selectedSectionId) {
      setError("Please select a section.");
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append("title", lectureFormData.title);
    data.append("duration", lectureFormData.duration);
    data.append("active", lectureFormData.active);
    data.append("section", selectedSectionId);
    data.append("is_draft", isDraft);
    if (lectureFormData.ppt_file) data.append("ppt", lectureFormData.ppt_file);
    if (lectureFormData.pdf_file) data.append("pdf", lectureFormData.pdf_file);
    if (lectureFormData.video_file)
      data.append("video_file", lectureFormData.video_file);

    try {
      const response = await axios.post(
        `https://backend-demo-esqk.onrender.com/trainer_gmt/sections/lectures/?section_id=${selectedSectionId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess(`Lecture "${response.data.title}" added successfully!`);
      setSections((prev) =>
        prev.map((course) =>
          course.id === createdCourseId && course.type === "course"
            ? {
                ...course,
                sections: course.sections.map((section) =>
                  section.id === selectedSectionId
                    ? {
                        ...section,
                        lectures: [
                          ...section.lectures,
                          {
                            type: "lecture",
                            id: response.data.id,
                            title: response.data.title,
                            duration: response.data.duration,
                            active: response.data.active,
                            video_file: response.data.video_file,
                            pdf: response.data.pdf,
                            ppt: response.data.ppt,
                          },
                        ],
                      }
                    : section
                ),
              }
            : course
        )
      );
      setLectureFormData({
        title: "",
        duration: "00:00:00",
        active: false,
        ppt_file: null,
        pdf_file: null,
        video_file: null,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Lecture creation failed.");
      console.error("Lecture API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const startNewCourse = () => {
    setCreatedCourseId(null);
    setSections([]);
    setSelectedSectionId("");
    setCourseFormData({
      author_name: "",
      course_title: "",
      course_price: "",
      course_rating: "",
      course_description: "",
      about_course: "",
      course_specification: "",
      preknowledge: "",
      why_this_course: "",
      course_image: null,
    });
    setSectionFormData({ section_title: "" });
    setLectureFormData({
      title: "",
      duration: "00:00:00",
      active: false,
      ppt_file: null,
      pdf_file: null,
      video_file: null,
    });
    setSuccess(null);
    setError(null);
    setActiveTab("basic");
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center py-5" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
      <style>
        {`
          .enhanced-card {
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            transition: all 0.3s ease;
          }
          
          .enhanced-card:hover {
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35);
          }
          
          .gradient-header {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            color: white;
            padding: 2rem;
            border-bottom: 4px solid rgba(255, 255, 255, 0.2);
          }
          
          .enhanced-tabs .nav-link {
            color: #1e40af;
            border: 2px solid transparent;
            border-radius: 12px;
            padding: 0.75rem 1.5rem;
            margin: 0 0.5rem;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .enhanced-tabs .nav-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(30, 64, 175, 0.1), transparent);
            transition: left 0.5s ease;
          }
          
          .enhanced-tabs .nav-link:hover::before {
            left: 100%;
          }
          
          .enhanced-tabs .nav-link:hover {
            background: rgba(30, 64, 175, 0.1);
            transform: translateY(-2px);
          }
          
          .enhanced-tabs .nav-link.active {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            color: white;
            border-color: transparent;
            box-shadow: 0 4px 15px rgba(30, 64, 175, 0.4);
          }
          
          .enhanced-tabs .nav-link.disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
          
          .form-label {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 0.5rem;
            font-size: 0.95rem;
          }
          
          .form-control, .form-select {
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            padding: 0.75rem 1rem;
            transition: all 0.3s ease;
            font-size: 0.95rem;
          }
          
          .form-control:focus, .form-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            outline: none;
          }
          
          .enhanced-btn {
            border-radius: 10px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            position: relative;
            overflow: hidden;
          }
          
          .enhanced-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s ease, height 0.6s ease;
          }
          
          .enhanced-btn:hover::before {
            width: 300px;
            height: 300px;
          }
          
          .enhanced-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          }
          
          .btn-success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          }
          
          .btn-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          }
          
          .btn-secondary {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          }
          
          .btn-dark {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          }
          
          .alert {
            border-radius: 12px;
            border: none;
            padding: 1rem 1.5rem;
            font-weight: 500;
            animation: slideDown 0.3s ease;
          }
          
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .alert-success {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            color: #065f46;
          }
          
          .alert-danger {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            color: #991b1b;
          }
          
          .spinner-border {
            width: 3rem;
            height: 3rem;
            border-width: 0.3rem;
          }
          
          .img-thumbnail {
            border: 3px solid #e2e8f0;
            border-radius: 12px;
            padding: 0.5rem;
            transition: all 0.3s ease;
          }
          
          .img-thumbnail:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          }
          
          .modal-content {
            border-radius: 20px;
            border: none;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }
          
          .modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 20px 20px 0 0;
            border-bottom: none;
            padding: 1.5rem 2rem;
          }
          
          .modal-title {
            font-weight: 700;
            font-size: 1.5rem;
          }
          
          .btn-close {
            filter: brightness(0) invert(1);
            opacity: 0.8;
          }
          
          .btn-close:hover {
            opacity: 1;
          }
          
          .table {
            border-radius: 10px;
            overflow: hidden;
          }
          
          .table thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          
          .table tbody tr {
            transition: all 0.3s ease;
          }
          
          .table tbody tr:hover {
            background: rgba(102, 126, 234, 0.05);
            transform: scale(1.01);
          }
          
          .form-check-input:checked {
            background-color: #667eea;
            border-color: #667eea;
          }
          
          .text-danger {
            color: #dc2626 !important;
          }
          
          .section-header {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 2rem;
          }
          
          .action-buttons-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
          }
          
          @media (max-width: 768px) {
            .enhanced-tabs .nav-link {
              margin: 0.25rem;
              padding: 0.5rem 1rem;
              font-size: 0.875rem;
            }
          }
        `}
      </style>
      
      <div className="enhanced-card" style={{ width: "100%", maxWidth: "75rem" }}>
        <div className="gradient-header">
          <h1 className="h3 fw-bold mb-0 text-center">Create New Course</h1>
          <p className="text-center mb-0 mt-2 opacity-90">Build comprehensive learning experiences</p>
        </div>

        <div className="card-body p-0">
          {isLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Processing your request...</p>
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger m-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success m-4" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </div>
          )}

          <ul className="nav nav-pills enhanced-tabs mb-4 justify-content-center pt-4 px-4" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "basic" ? "active" : ""}`}
                onClick={() => setActiveTab("basic")}
                type="button"
              >
                <i className="bi bi-info-circle me-2"></i>
                Basic Information
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "section" ? "active" : ""} ${!createdCourseId ? "disabled" : ""}`}
                onClick={() => createdCourseId && setActiveTab("section")}
                disabled={!createdCourseId}
                type="button"
              >
                <i className="bi bi-list-task me-2"></i>
                Section Title
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "lecture" ? "active" : ""} ${sections.length === 0 ? "disabled" : ""}`}
                onClick={() => sections.length > 0 && setActiveTab("lecture")}
                disabled={sections.length === 0}
                type="button"
              >
                <i className="bi bi-camera-video me-2"></i>
                Lecture Info
              </button>
            </li>
          </ul>

          <div className="tab-content pb-0" id="pills-tabContent">
            <div
              className={`tab-pane fade ${activeTab === "basic" ? "show active" : ""}`}
              id="pills-basic"
            >
              <form onSubmit={handleCourseSubmit} className="p-4">
                <div className="row g-4 mb-4">
                  <div className="col-md-4">
                    <label htmlFor="author_name" className="form-label">
                      Author Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="author_name"
                      value={courseFormData.author_name}
                      onChange={handleCourseInputChange}
                      required
                      maxLength="255"
                      placeholder="Enter author name"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="course_title" className="form-label">
                      Course Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="course_title"
                      value={courseFormData.course_title}
                      onChange={handleCourseInputChange}
                      required
                      maxLength="255"
                      placeholder="Enter course title"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="course_price" className="form-label">
                      Price ($) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="course_price"
                      value={courseFormData.course_price}
                      onChange={handleCourseInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-md-4">
                    <label htmlFor="course_description" className="form-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="course_description"
                      value={courseFormData.course_description}
                      onChange={handleCourseInputChange}
                      rows="3"
                      required
                      placeholder="Brief course description"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="about_course" className="form-label">
                      About This Course <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="about_course"
                      value={courseFormData.about_course}
                      onChange={handleCourseInputChange}
                      rows="3"
                      required
                      placeholder="Detailed information about the course"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="course_specification" className="form-label">
                      Course Specification <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="course_specification"
                      value={courseFormData.course_specification}
                      onChange={handleCourseInputChange}
                      rows="3"
                      required
                      placeholder="Course specifications and requirements"
                    />
                  </div>
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-md-4">
                    <label htmlFor="preknowledge" className="form-label">
                      Preknowledge Required <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="preknowledge"
                      value={courseFormData.preknowledge}
                      onChange={handleCourseInputChange}
                      rows="3"
                      required
                      placeholder="Required background knowledge"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="why_this_course" className="form-label">
                      Why Take This Course <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="why_this_course"
                      value={courseFormData.why_this_course}
                      onChange={handleCourseInputChange}
                      rows="3"
                      required
                      placeholder="Benefits and value of this course"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="course_rating" className="form-label">
                      Rating (0-5) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="course_rating"
                      value={courseFormData.course_rating}
                      onChange={handleCourseInputChange}
                      required
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="0.0"
                    />
                    <div className="mt-2">
                      <StarRating rating={parseFloat(courseFormData.course_rating) || 0} />
                    </div>
                  </div>
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="course_image" className="form-label">
                      Course Image <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      name="course_image"
                      onChange={handleCourseInputChange}
                      accept="image/jpeg,image/png,image/gif"
                    />
                    <small className="text-muted">Max size: 5MB. Formats: JPEG, PNG, GIF</small>
                    {courseFormData.course_image && (
                      <div className="mt-3">
                        <img
                          src={URL.createObjectURL(courseFormData.course_image)}
                          alt="Preview"
                          className="img-thumbnail"
                          style={{ maxWidth: "150px", maxHeight: "150px" }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
                  <button
                    type="button"
                    className="btn btn-secondary enhanced-btn"
                    onClick={() => navigate("/dashboard/trainer")}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel
                  </button>
                  <div className="d-flex gap-3">
                    <button
                      onClick={toggleModal}
                      type="button"
                      className="btn btn-dark enhanced-btn"
                    >
                      <i className="bi bi-eye me-2"></i>
                      {showModal ? "Hide Details" : "Show Details"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary enhanced-btn"
                      disabled={isLoading}
                      onClick={() => {
                        setIsDraft(true);
                        handleCourseSubmit(new Event("submit"));
                      }}
                    >
                      <i className="bi bi-file-earmark me-2"></i>
                      {isLoading ? "Saving..." : "Save as Draft"}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-success enhanced-btn"
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      {isLoading ? "Publishing..." : "Publish Course"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div
              className={`tab-pane fade ${activeTab === "section" ? "show active" : ""}`}
              id="pills-section"
            >
              {createdCourseId && (
                <form onSubmit={handleSectionSubmit} className="p-4">
                  <div className="section-header">
                    <h2 className="h4 fw-bold text-dark mb-2">
                      <i className="bi bi-list-task me-2"></i>
                      Add Section for Course ID: {createdCourseId}
                    </h2>
                    <p className="text-muted mb-0">Organize your course content into sections</p>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-8">
                      <label htmlFor="section_title" className="form-label">
                        Section Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="section_title"
                        value={sectionFormData.section_title}
                        onChange={handleSectionInputChange}
                        required
                        maxLength="255"
                        placeholder="e.g., Introduction, Advanced Topics, etc."
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
                    <button
                      type="button"
                      className="btn btn-secondary enhanced-btn"
                      onClick={startNewCourse}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      New Course
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-success enhanced-btn"
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      {isLoading ? "Adding Section..." : "Add Section"}
                    </button>
                  </div>

                  <div className="action-buttons-grid mt-5 pt-4 border-top">
                    <button
                      type="button"
                      className="btn btn-dark enhanced-btn"
                      onClick={() => {
                        localStorage.setItem("topicId", createdCourseId);
                        navigate(`/dashboard/trainer/topic-create`);
                      }}
                    >
                      <i className="bi bi-question-circle me-2"></i>
                      Create Quiz
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark enhanced-btn"
                      onClick={() => {
                        localStorage.setItem("courseId", createdCourseId);
                        navigate(`/dashboard/trainer/create-assignment`);
                      }}
                    >
                      <i className="bi bi-file-text me-2"></i>
                      Create Assignment
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark enhanced-btn"
                      onClick={() => {
                        localStorage.setItem("courseId", createdCourseId);
                        navigate(`/dashboard/trainer/create-project`);
                      }}
                    >
                      <i className="bi bi-folder me-2"></i>
                      Create Project
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark enhanced-btn"
                      onClick={() => {
                        localStorage.setItem("courseId", createdCourseId);
                        navigate(`/dashboard/trainer/create-task`);
                      }}
                    >
                      <i className="bi bi-clipboard-check me-2"></i>
                      Create Task
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div
              className={`tab-pane fade ${activeTab === "lecture" ? "show active" : ""}`}
              id="pills-lecture"
            >
              {createdCourseId && sections.length > 0 && (
                <form onSubmit={handleLectureSubmit} className="p-4">
                  <div className="section-header">
                    <h2 className="h4 fw-bold text-dark mb-2">
                      <i className="bi bi-camera-video me-2"></i>
                      Add Lecture
                    </h2>
                    <p className="text-muted mb-0">Upload lecture materials and content</p>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <label htmlFor="section_id" className="form-label">
                        Select Section <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="section_id"
                        value={selectedSectionId}
                        onChange={(e) => setSelectedSectionId(e.target.value)}
                        required
                      >
                        <option value="">Choose a section...</option>
                        {sections
                          .find((course) => course.id === createdCourseId)
                          ?.sections.map((section) => (
                            <option key={section.id} value={section.id}>
                              {section.section_title}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="title" className="form-label">
                        Lecture Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={lectureFormData.title}
                        onChange={handleLectureInputChange}
                        required
                        maxLength="255"
                        placeholder="Enter lecture title"
                      />
                    </div>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <label htmlFor="duration" className="form-label">
                        Duration (HH:MM:SS) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="duration"
                        value={lectureFormData.duration}
                        onChange={handleLectureInputChange}
                        required
                        pattern="\d{2}:\d{2}:\d{2}"
                        placeholder="00:00:00"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label d-block">Status</label>
                      <div className="form-check form-switch mt-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="active"
                          checked={lectureFormData.active}
                          onChange={handleLectureInputChange}
                          style={{ width: '3rem', height: '1.5rem' }}
                        />
                        <label className="form-check-label ms-2">
                          {lectureFormData.active ? 'Active' : 'Inactive'}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-4">
                      <label htmlFor="ppt_file" className="form-label">
                        <i className="bi bi-file-earmark-ppt me-2"></i>
                        PPT File (Optional)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        name="ppt_file"
                        onChange={handleLectureInputChange}
                        accept=".ppt,.pptx"
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="pdf_file" className="form-label">
                        <i className="bi bi-file-earmark-pdf me-2"></i>
                        PDF File (Optional)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        name="pdf_file"
                        onChange={handleLectureInputChange}
                        accept=".pdf"
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="video_file" className="form-label">
                        <i className="bi bi-camera-video me-2"></i>
                        Video File (Optional)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        name="video_file"
                        onChange={handleLectureInputChange}
                        accept=".mp4,.mkv,.avi"
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
                    <button
                      type="button"
                      className="btn btn-secondary enhanced-btn"
                      onClick={startNewCourse}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      New Course
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-success enhanced-btn"
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      {isLoading ? "Adding Lecture..." : "Add Lecture"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div
            className={`modal fade ${showModal ? "show d-block" : ""}`}
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "transparent" }}
          >
            <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-info-circle me-2"></i>
                    Course Details Overview
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={toggleModal}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  {sections.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#cbd5e1' }}></i>
                      <p className="text-muted mt-3 h5">No data available</p>
                      <p className="text-muted">Create a course, section, or lecture first.</p>
                    </div>
                  ) : (
                    sections.map((course) => (
                      <div key={course.id} className="mb-5">
                        <div className="section-header">
                          <h3 className="h5 fw-bold mb-0">
                            <i className="bi bi-book me-2"></i>
                            {course.title} <span className="badge bg-primary ms-2">ID: {course.id}</span>
                          </h3>
                        </div>

                        <div className="card border-0 shadow-sm mt-3">
                          <div className="card-body">
                            <div className="row g-3">
                              <div className="col-md-6">
                                <strong className="text-muted">Author:</strong>
                                <p className="mb-0">{course.author_name}</p>
                              </div>
                              <div className="col-md-3">
                                <strong className="text-muted">Price:</strong>
                                <p className="mb-0">${course.price}</p>
                              </div>
                              <div className="col-md-3">
                                <strong className="text-muted">Rating:</strong>
                                <div>
                                  <StarRating rating={parseFloat(course.rating)} />
                                  <span className="ms-2">{course.rating}</span>
                                </div>
                              </div>
                              <div className="col-12">
                                <strong className="text-muted">Description:</strong>
                                <p className="mb-0">{course.description}</p>
                              </div>
                              <div className="col-12">
                                <strong className="text-muted">About Course:</strong>
                                <p className="mb-0">{course.about_course}</p>
                              </div>
                              <div className="col-12">
                                <strong className="text-muted">Specification:</strong>
                                <p className="mb-0">{course.course_specification}</p>
                              </div>
                              <div className="col-12">
                                <strong className="text-muted">Preknowledge:</strong>
                                <p className="mb-0">{course.preknowledge}</p>
                              </div>
                              <div className="col-12">
                                <strong className="text-muted">Why This Course:</strong>
                                <p className="mb-0">{course.why_this_course}</p>
                              </div>
                              <div className="col-12">
                                <strong className="text-muted">Course Image:</strong>
                                <p className="mb-0">
                                  {course.course_image ? (
                                    <span className="badge bg-success">
                                      <i className="bi bi-check-circle me-1"></i>
                                      Uploaded
                                    </span>
                                  ) : (
                                    <span className="badge bg-secondary">None</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {course.sections.length > 0 && (
                          <div className="mt-4">
                            <h4 className="h6 fw-bold mb-3">
                              <i className="bi bi-list-task me-2"></i>
                              Sections ({course.sections.length})
                            </h4>
                            {course.sections.map((section) => (
                              <div key={section.id} className="card border-0 shadow-sm mb-3">
                                <div className="card-header" style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' }}>
                                  <h5 className="h6 mb-0">
                                    <i className="bi bi-folder2-open me-2"></i>
                                    {section.section_title} 
                                    <span className="badge bg-secondary ms-2">ID: {section.id}</span>
                                  </h5>
                                </div>
                                {section.lectures.length > 0 && (
                                  <div className="card-body">
                                    <h6 className="fw-bold mb-3">
                                      <i className="bi bi-camera-video me-2"></i>
                                      Lectures ({section.lectures.length})
                                    </h6>
                                    <div className="table-responsive">
                                      <table className="table table-hover align-middle">
                                        <thead>
                                          <tr>
                                            <th>ID</th>
                                            <th>Title</th>
                                            <th>Duration</th>
                                            <th>Status</th>
                                            <th>Files</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {section.lectures.map((lecture) => (
                                            <tr key={lecture.id}>
                                              <td><span className="badge bg-light text-dark">{lecture.id}</span></td>
                                              <td className="fw-semibold">{lecture.title}</td>
                                              <td>
                                                <i className="bi bi-clock me-1"></i>
                                                {lecture.duration}
                                              </td>
                                              <td>
                                                {lecture.active ? (
                                                  <span className="badge bg-success">
                                                    <i className="bi bi-check-circle me-1"></i>
                                                    Active
                                                  </span>
                                                ) : (
                                                  <span className="badge bg-secondary">
                                                    <i className="bi bi-x-circle me-1"></i>
                                                    Inactive
                                                  </span>
                                                )}
                                              </td>
                                              <td>
                                                <div className="d-flex gap-2">
                                                  {lecture.video_file && (
                                                    <span className="badge bg-primary">
                                                      <i className="bi bi-camera-video me-1"></i>
                                                      Video
                                                    </span>
                                                  )}
                                                  {lecture.pdf && (
                                                    <span className="badge bg-danger">
                                                      <i className="bi bi-file-pdf me-1"></i>
                                                      PDF
                                                    </span>
                                                  )}
                                                  {lecture.ppt && (
                                                    <span className="badge bg-warning text-dark">
                                                      <i className="bi bi-file-ppt me-1"></i>
                                                      PPT
                                                    </span>
                                                  )}
                                                  {!lecture.video_file && !lecture.pdf && !lecture.ppt && (
                                                    <span className="badge bg-secondary">None</span>
                                                  )}
                                                </div>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary enhanced-btn"
                    onClick={toggleModal}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;