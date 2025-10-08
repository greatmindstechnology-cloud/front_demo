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
    <div className="d-flex justify-content-center align-items-center h-100 bg-light">
      <div className="card border border-0 shadow" style={{ width: "68rem" }}>
        <div className="card-body p-0">
          <div
            className={`tab-pane fade ${activeTab === "section" ? "show active" : ""}`}
            id="pills-section"
            role="tabpanel"
            aria-labelledby="pills-section-tab"
            tabIndex="0"
            style={{ width: "68rem" }}
          >
            {createdCourseId && (
              <form onSubmit={handleSectionSubmit} className="row g-4 p-4">
                <div className="col-12">
                  <h2 className="h4 fw-bold text-dark">
                    Add Section for Course ID: {createdCourseId}
                  </h2>
                </div>
                <div className="row mb-4">
                  <div className="col-md-6">
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
                    />
                  </div>
                </div>

                <div className="col-12 d-flex mt-4">
                  <div className="p-2 w-100">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={startNewCourse}
                    >
                      New Course
                    </button>
                  </div>
                  <div className="p-2 d-flex flex-shrink-1">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-success"
                    >
                      {isLoading ? "Adding Section..." : "Add Section"}
                    </button>
                  </div>
                </div>

                <div className="col-12 d-flex mt-4">
                  <button
                    type="button"
                    className="btn btn-dark me-3"
                    onClick={() => {
                      localStorage.setItem("topicId", createdCourseId);
                      navigate(`/dashboard/trainer/topic-create`);
                    }}
                  >
                    Create Quiz
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark me-3"
                    onClick={() => {
                      localStorage.setItem("courseId", createdCourseId);
                      navigate(`/dashboard/trainer/create-assignment`);
                    }}
                  >
                    Create Assignment
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark me-3"
                    onClick={() => {
                      localStorage.setItem("courseId", createdCourseId);
                      navigate(`/dashboard/trainer/create-project`);
                    }}
                  >
                    Create Project
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => {
                      localStorage.setItem("courseId", createdCourseId);
                      navigate(`/dashboard/trainer/create-task`);
                    }}
                  >
                    Create Task
                  </button>
                </div>
              </form>
            )}
          </div>
          <h1 className="h4 fw-bold text-dark mb-4 mt-4 text-center">
            Create New Course
          </h1>

          {isLoading && (
            <div className="text-center">
              <div className="spinner-border" role="status"></div>
            </div>
          )}
          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}
          {success && (
            <div className="alert alert-success text-center">{success}</div>
          )}

          <ul
            className="nav nav-pills mb-3 justify-content-center"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "basic" ? "active" : ""}`}
                id="pills-basic-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-basic"
                type="button"
                role="tab"
                aria-controls="pills-basic"
                aria-selected={activeTab === "basic"}
                onClick={() => setActiveTab("basic")}
              >
                Basic Information
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "section" ? "active" : ""} ${!createdCourseId ? "disabled" : ""}`}
                id="pills-section-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-section"
                type="button"
                role="tab"
                aria-controls="pills-section"
                aria-selected={activeTab === "section"}
                onClick={() => createdCourseId && setActiveTab("section")}
                disabled={!createdCourseId}
              >
                Section Title
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "lecture" ? "active" : ""} ${sections.length === 0 ? "disabled" : ""}`}
                id="pills-lecture-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-lecture"
                type="button"
                role="tab"
                aria-controls="pills-lecture"
                aria-selected={activeTab === "lecture"}
                onClick={() => sections.length > 0 && setActiveTab("lecture")}
                disabled={sections.length === 0}
              >
                Lecture Info
              </button>
            </li>
          </ul>

          <div className="tab-content pb-0 shadow-none" id="pills-tabContent">
            <div
              className={`tab-pane fade ${activeTab === "basic" ? "show active" : ""}`}
              id="pills-basic"
              role="tabpanel"
              aria-labelledby="pills-basic-tab"
              tabIndex="0"
              style={{ width: "68rem" }}
            >
              <form onSubmit={handleCourseSubmit} className="row g-4 p-4">
                <div className="row mb-4">
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
                    />
                  </div>
                </div>
                <div className="row mb-4">
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
                    />
                  </div>
                  <div className="col-md-4">
                    <label
                      htmlFor="course_specification"
                      className="form-label"
                    >
                      Course Specification{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="course_specification"
                      value={courseFormData.course_specification}
                      onChange={handleCourseInputChange}
                      rows="3"
                      required
                    />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-4">
                    <label htmlFor="preknowledge" className="form-label">
                      Preknowledge Required{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="preknowledge"
                      value={courseFormData.preknowledge}
                      onChange={handleCourseInputChange}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="why_this_course" className="form-label">
                      Why Take This Course{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="why_this_course"
                      value={courseFormData.why_this_course}
                      onChange={handleCourseInputChange}
                      rows="3"
                      required
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
                    />
                    <StarRating
                      rating={parseFloat(courseFormData.course_rating) || 0}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
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
                    {courseFormData.course_image && (
                      <img
                        src={URL.createObjectURL(courseFormData.course_image)}
                        alt="Preview"
                        className="mt-2 img-thumbnail"
                        style={{ maxWidth: "128px", maxHeight: "128px" }}
                      />
                    )}
                  </div>
                </div>
                <div className="col-12 d-flex mt-4">
                  <div className="p-2 w-100">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate("/dashboard/trainer")}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="p-2 d-flex flex-shrink-1">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-success"
                    >
                      {isLoading ? "Publishing..." : "Publish"}
                    </button>
                    <button
                      onClick={toggleModal}
                      className="btn btn-success text-truncate ms-3"
                    >
                      {showModal ? "Hide Details" : "Show Details"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary ms-3 text-truncate"
                      disabled={isLoading}
                      onClick={() => {
                        setIsDraft(true);
                        handleCourseSubmit(new Event("submit"));
                      }}
                    >
                      {isLoading ? "Saving..." : "Save as Draft"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div
              className={`tab-pane fade ${activeTab === "section" ? "show active" : ""}`}
              id="pills-section"
              role="tabpanel"
              aria-labelledby="pills-section-tab"
              tabIndex="0"
              style={{ width: "68rem" }}
            >
              {createdCourseId && (
                <form onSubmit={handleSectionSubmit} className="row g-4 p-4">
                  <div className="col-12">
                    <h2 className="h4 fw-bold text-dark">
                      Add Section for Course ID: {createdCourseId}
                    </h2>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-6">
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
                      />
                    </div>
                  </div>
                  <div className="col-12 d-flex mt-4">
                    <div className="p-2 w-100">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={startNewCourse}
                      >
                        New Course
                      </button>
                    </div>
                    <div className="p-2 d-flex flex-shrink-1">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-success"
                      >
                        {isLoading ? "Adding Section..." : "Add Section"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            <div
              className={`tab-pane fade ${activeTab === "lecture" ? "show active" : ""}`}
              id="pills-lecture"
              role="tabpanel"
              aria-labelledby="pills-lecture-tab"
              tabIndex="0"
              style={{ width: "68rem" }}
            >
              {createdCourseId && sections.length > 0 && (
                <form onSubmit={handleLectureSubmit} className="row g-4 p-4">
                  <div className="col-12">
                    <h2 className="h4 fw-bold text-dark">Add Lecture</h2>
                  </div>
                  <div className="row mb-4">
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
                        <option value="">Select a section</option>
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
                      />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="duration" className="form-label">
                        Duration (HH:MM:SS){" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="duration"
                        value={lectureFormData.duration}
                        onChange={handleLectureInputChange}
                        required
                        pattern="\d{2}:\d{2}:\d{2}"
                        placeholder="HH:MM:SS"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="active" className="form-label">
                        Active
                      </label>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="active"
                          checked={lectureFormData.active}
                          onChange={handleLectureInputChange}
                        />
                        <label htmlFor="active" className="form-check-label">
                          Active
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="ppt_file" className="form-label">
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
                    <div className="col-md-6">
                      <label htmlFor="pdf_file" className="form-label">
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
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="video_file" className="form-label">
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
                  <div className="col-12 d-flex mt-4">
                    <div className="p-2 w-100">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={startNewCourse}
                      >
                        New Course
                      </button>
                    </div>
                    <div className="p-2 d-flex flex-shrink-1">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-success"
                      >
                        {isLoading ? "Adding Lecture..." : "Add Lecture"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div
            className={`modal fade ${showModal ? "show d-block" : ""}`}
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{ width: "70rem" }}>
                <div className="modal-header">
                  <h5 className="modal-title">Course Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={toggleModal}
                  ></button>
                </div>
                <div className="modal-body">
                  {sections.length === 0 ? (
                    <p className="text-center text-muted">
                      No data available. Create a course, section, or lecture
                      first.
                    </p>
                  ) : (
                    sections.map((course) => (
                      <div key={course.id} className="mb-4">
                        <h3 className="h5 fw-bold">
                          Course: {course.title} (ID: {course.id})
                        </h3>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            Price: ${course.price}
                          </li>
                          <li className="list-group-item">
                            Rating: {course.rating}{" "}
                            <StarRating rating={parseFloat(course.rating)} />
                          </li>
                          <li className="list-group-item">
                            Description: {course.description}
                          </li>
                          <li className="list-group-item">
                            About: {course.about_course}
                          </li>
                          <li className="list-group-item">
                            Specification: {course.course_specification}
                          </li>
                          <li className="list-group-item">
                            Preknowledge: {course.preknowledge}
                          </li>
                          <li className="list-group-item">
                            Why: {course.why_this_course}
                          </li>
                          <li className="list-group-item">
                            Image: {course.course_image ? "Uploaded" : "None"}
                          </li>
                        </ul>
                        {course.sections.length > 0 && (
                          <div className="mt-3">
                            <h4 className="h6 fw-bold">Sections</h4>
                            {course.sections.map((section) => (
                              <div key={section.id} className="ms-3 mt-2">
                                <h5 className="h6">
                                  Section: {section.section_title} (ID:{" "}
                                  {section.id})
                                </h5>
                                {section.lectures.length > 0 && (
                                  <div className="ms-3 mt-2">
                                    <h6 className="h6">Lectures</h6>
                                    <table className="table table-bordered">
                                      <thead>
                                        <tr>
                                          <th>ID</th>
                                          <th>Title</th>
                                          <th>Duration</th>
                                          <th>Active</th>
                                          <th>Files</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {section.lectures.map((lecture) => (
                                          <tr key={lecture.id}>
                                            <td>{lecture.id}</td>
                                            <td>{lecture.title}</td>
                                            <td>{lecture.duration}</td>
                                            <td>
                                              {lecture.active ? "Yes" : "No"}
                                            </td>
                                            <td>
                                              <ul className="list-unstyled">
                                                <li>
                                                  Video:{" "}
                                                  {lecture.video_file
                                                    ? "Uploaded"
                                                    : "None"}
                                                </li>
                                                <li>
                                                  PDF:{" "}
                                                  {lecture.pdf
                                                    ? "Uploaded"
                                                    : "None"}
                                                </li>
                                                <li>
                                                  PPT:{" "}
                                                  {lecture.ppt
                                                    ? "Uploaded"
                                                    : "None"}
                                                </li>
                                              </ul>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
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
                    className="btn btn-secondary"
                    onClick={toggleModal}
                  >
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
