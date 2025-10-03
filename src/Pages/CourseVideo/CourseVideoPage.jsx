// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import "./CourseVideoPage.css";

// const CourseVideoPage = () => {
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("Overview");
//   const [activeLectureInfo, setActiveLectureInfo] = useState({
//     sectionTitle: "",
//     lectureTitle: "",
//     video: "",
//   });
//   const [expandedSections, setExpandedSections] = useState({});
//   const [completionPercentage, setCompletionPercentage] = useState(0);
//   const [sections, setSections] = useState([]);

//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           `http://localhost:8000/course_gmt/course/details/?course_id=${id}`
//         );
//         const fetchedCourse = res.data;
//         console.log("Fetched Course Data:", fetchedCourse);
//         setCourse(fetchedCourse);

//         const parsedSections = fetchedCourse.sections || [];
//         setSections(parsedSections);

//         const initialExpanded = parsedSections.reduce((acc, _, index) => {
//           acc[index] = false;
//           return acc;
//         }, {});
//         setExpandedSections(initialExpanded);

//         const firstSectionWithLectures = parsedSections.find(
//           (s) => s.lectures && s.lectures.length > 0
//         );
//         const initialActive = firstSectionWithLectures?.lectures[0] || {};
//         setActiveLectureInfo({
//           sectionTitle: firstSectionWithLectures?.section_title || "",
//           lectureTitle: initialActive.title || "",
//           video: initialActive.video_file || "",
//         });

//         const updatedSections = parsedSections.map((s) => ({
//           ...s,
//           lectures: s.lectures.map((l, i) => ({
//             ...l,
//             active: i === 0 && s.id === firstSectionWithLectures?.id,
//           })),
//         }));
//         setSections(updatedSections);

//         calculateCompletionPercentage(updatedSections);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch course data");
//         setLoading(false);
//         console.error("Error fetching course:", err);
//       }
//     };
//     fetchCourse();
//   }, [id]);

//   const calculateCompletionPercentage = (sectionsData) => {
//     const totalLectures = sectionsData.reduce(
//       (total, section) => total + section.lectures.length,
//       0
//     );
//     const completedLectures = sectionsData.reduce(
//       (total, section) =>
//         total + section.lectures.filter((lecture) => lecture.completed).length,
//       0
//     );
//     const percentage =
//       totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
//     setCompletionPercentage(Math.round(percentage));
//   };

//   const toggleSection = (sectionIndex) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [sectionIndex]: !prev[sectionIndex],
//     }));
//   };

//   const handleLectureClick = (section, lecture) => {
//     setActiveLectureInfo({
//       sectionTitle: section.section_title,
//       lectureTitle: lecture.title,
//       video: lecture.video_file || "", // Ensure video_file is used
//     });

//     const updatedSections = sections.map((s) => ({
//       ...s,
//       lectures: s.lectures.map((l) => ({
//         ...l,
//         active: l.id === lecture.id,
//         completed: l.id === lecture.id ? true : l.completed,
//       })),
//     }));
//     setSections(updatedSections);
//     calculateCompletionPercentage(updatedSections);
//   };

//   if (loading) return <div className="loading">Loading...</div>;
//   if (error) return <div className="error">{error}</div>;

//   const tabs = ["Overview", "Lectures Notes", "Attach File", "Announcements"];

//   return (
//     <div className="container">
//       {/* Course Header */}
//       <div className="course-header">
//         <div className="course-info">
//           <div className="play-icon">
//             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeWidth="2"
//                 d="M14.5 3H9.5l-2 7h9l-2-7zM7 10l-4 11h18l-4-11H7z"
//               />
//             </svg>
//           </div>
//           <div className="course-details">
//             <h1>{course.course_title}</h1>
//             <div className="meta">
//               <div className="meta-item">
//                 <svg fill="none" stroke="#f97316" viewBox="0 0 24 24">
//                   <path
//                     strokeWidth="1.3"
//                     d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6l4 2"
//                   />
//                 </svg>
//                 <span>{course.course_specification}</span>
//               </div>
//               <div className="meta-item">
//                 <svg fill="none" stroke="#4f46e5" viewBox="0 0 24 24">
//                   <path strokeWidth="1.3" d="M12 4v16m-8-8h16" />
//                 </svg>
//                 <span>
//                   {sections.reduce((total, s) => total + s.lectures.length, 0)}{" "}
//                   lectures
//                 </span>
//               </div>
//               <div className="meta-item">
//                 <svg fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
//                   <path strokeWidth="1.3" d="M12 2v10l4 2" />
//                 </svg>
//                 <span>{course.course_specification.split(",")[0].trim()}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="actions">
//           <button className="review-btn">Write a Review</button>
//           <button className="next-btn">Next Lecture</button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="main-content">
//         {/* Video and Description */}
//         <div className="content-left">
//           {/* Video Player */}
//           <div className="video-container">
//             <video
//               className="video-player"
//               src={activeLectureInfo.video}
//               controls
//               poster={course.course_image}
//             >
//               Your browser does not support the video tag.
//             </video>
//           </div>

//           {/* Lecture Info */}
//           <div className="lecture-info">
//             <h2>{activeLectureInfo.lectureTitle}</h2>
//             <div className="lecture-meta">
//               <div className="author">
//                 <img src="https://placehold.co/32x32" alt="Author" />
//                 <div>
//                   <div className="by">by</div>
//                   <div className="author-name">{course.author || "JDK"}</div>
//                   <div className="rating">
//                     {[...Array(5)].map((_, i) => (
//                       <svg
//                         key={i}
//                         className={
//                           i < Math.floor(course.course_rating || 0)
//                             ? "star-filled"
//                             : "star-empty"
//                         }
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path d="M10 15l-5.5 3 1-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-3.5 4.5 1 5.5z" />
//                       </svg>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="updated">Last updated: Oct 26, 2020</div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="tabs">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 className={activeTab === tab ? "tab active" : "tab"}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab}
//                 {tab === "Attach File" && <span className="file-count">01</span>}
//               </button>
//             ))}
//           </div>

//           {/* Tab Content */}
//           {activeTab === "Overview" && (
//             <div className="tab-content">
//               <h3>Overview</h3>
//               <p>{course.course_description || "Master Java from basic to advanced..."}</p>
//             </div>
//           )}
//           {activeTab === "Lectures Notes" && (
//             <div className="tab-content">
//               <h3>Lectures Notes</h3>
//               <p>No lecture notes available.</p>
//             </div>
//           )}
//           {activeTab === "Attach File" && (
//             <div className="tab-content">
//               <h3>Attach File</h3>
//               <div className="file-item">
//                 <svg
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   className="file-icon"
//                   style={{ width: "31px", height: "31px", color: "#f97316" }}
//                 >
//                   <path
//                     strokeWidth="1.5"
//                     d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
//                   />
//                   <path strokeWidth="1.5" d="M14 2v6h6" />
//                 </svg>
//                 <span>Course Material.pdf</span>
//                 <button className="download-btn">Download File</button>
//               </div>
//             </div>
//           )}
//           {activeTab === "Announcements" && (
//             <div className="tab-content">
//               <h3>Announcements</h3>
//               <p>No announcements available.</p>
//             </div>
//           )}
//         </div>

//         {/* Course Contents Sidebar */}
//         <div className="sidebar">
//           <div className="progress">
//             <div className="progress-header">
//               <h3>Contents</h3>
//               <span className="progress-text">{completionPercentage}% Completed</span>
//             </div>
//             <div className="progress-bar">
//               <div
//                 className="progress-filled"
//                 style={{ width: `${completionPercentage}%` }}
//               ></div>
//             </div>
//           </div>
//           <div className="contents">
//             {sections.map((section, index) => {
//               const lectureCount = section.lectures.length;
//               const totalDuration = section.lectures.reduce(
//                 (total, lecture) => {
//                   const [hours, minutes, seconds] = lecture.duration
//                     .split(":")
//                     .map(Number);
//                   return total + hours * 3600 + minutes * 60 + seconds;
//                 },
//                 0
//               );
//               const durationMinutes = Math.floor(totalDuration / 60);
//               const durationSeconds = totalDuration % 60;
//               const formattedDuration = `${durationMinutes}m ${durationSeconds}s`;

//               return (
//                 <div key={section.id} className="section">
//                   <div
//                     className="section-header"
//                     onClick={() => toggleSection(index)}
//                   >
//                     <div className="section-title">
//                       <svg
//                         fill="none"
//                         stroke="#f97316"
//                         viewBox="0 0 24 24"
//                         className={expandedSections[index] ? "rotate-90" : ""}
//                       >
//                         <path strokeWidth="1.5" d="M9 5l7 7-7 7" />
//                       </svg>
//                       <span>{section.section_title}</span>
//                     </div>
//                     <div className="section-meta">
//                       <div className="meta-item">
//                         <svg fill="none" stroke="#4f46e5" viewBox="0 0 24 24">
//                           <path strokeWidth="1.3" d="M12 4v16m-8-8h16" />
//                         </svg>
//                         <span>{lectureCount} lectures</span>
//                       </div>
//                       <div className="meta-item">
//                         <svg fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
//                           <path strokeWidth="1.3" d="M12 2v10l4 2" />
//                         </svg>
//                         <span>{formattedDuration}</span>
//                       </div>
//                     </div>
//                   </div>
//                   {expandedSections[index] && (
//                     <div className="lectures">
//                       {section.lectures.map((lecture) => (
//                         <div
//                           key={lecture.id}
//                           className={`lecture ${lecture.active ? "active" : ""}`}
//                           onClick={() => handleLectureClick(section, lecture)}
//                         >
//                           <div className="lecture-info">
//                             <div
//                               className={`status ${
//                                 lecture.completed
//                                   ? "completed"
//                                   : lecture.active
//                                   ? "active"
//                                   : ""
//                               }`}
//                             >
//                               {lecture.completed && (
//                                 <svg
//                                   fill="none"
//                                   stroke="white"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path strokeWidth="1.5" d="M5 13l4 4L19 7" />
//                                 </svg>
//                               )}
//                             </div>
//                             <span>{lecture.title}</span>
//                           </div>
//                           <div className="lecture-time">
//                             <svg fill="currentColor" viewBox="0 0 24 24">
//                               <path d="M8 5v14l11-7z" />
//                             </svg>
//                             <span>{lecture.duration}</span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseVideoPage;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CourseVideoPage.css";

const BACKEND_BASE_URL = "http://localhost:8000";

const CourseVideoPage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeLectureInfo, setActiveLectureInfo] = useState({
    sectionTitle: "",
    lectureTitle: "",
    video: "",
  });
  const [expandedSections, setExpandedSections] = useState({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [sections, setSections] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_BASE_URL}/course_gmt/course/details/?course_id=${id}`);
        const fetchedCourse = res.data;
        console.log("Fetched Course Data:", fetchedCourse);
        setCourse(fetchedCourse);

        const parsedSections = fetchedCourse.sections || [];
        setSections(parsedSections);

        const initialExpanded = parsedSections.reduce((acc, _, index) => {
          acc[index] = false;
          return acc;
        }, {});
        setExpandedSections(initialExpanded);

        const firstSectionWithLectures = parsedSections.find(
          (s) => s.lectures && s.lectures.length > 0
        );
        const initialActive = firstSectionWithLectures?.lectures[0] || {};
        setActiveLectureInfo({
          sectionTitle: firstSectionWithLectures?.section_title || "",
          lectureTitle: initialActive.title || "",
          video: initialActive.video_file ? `${BACKEND_BASE_URL}${initialActive.video_file}` : "",
        });

        const updatedSections = parsedSections.map((s) => ({
          ...s,
          lectures: s.lectures.map((l, i) => ({
            ...l,
            active: i === 0 && s.id === firstSectionWithLectures?.id,
            video_file: l.video_file ? `${BACKEND_BASE_URL}${l.video_file}` : "",
          })),
        }));
        setSections(updatedSections);

        calculateCompletionPercentage(updatedSections);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch course data");
        setLoading(false);
        console.error("Error fetching course:", err);
      }
    };
    fetchCourse();
  }, [id]);

  const calculateCompletionPercentage = (sectionsData) => {
    const totalLectures = sectionsData.reduce(
      (total, section) => total + section.lectures.length,
      0
    );
    const completedLectures = sectionsData.reduce(
      (total, section) =>
        total + section.lectures.filter((lecture) => lecture.completed).length,
      0
    );
    const percentage = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
    setCompletionPercentage(Math.round(percentage));
  };

  const toggleSection = (sectionIndex) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  };

  const handleLectureClick = (section, lecture) => {
    setActiveLectureInfo({
      sectionTitle: section.section_title,
      lectureTitle: lecture.title,
      video: lecture.video_file || "",
    });

    const updatedSections = sections.map((s) => ({
      ...s,
      lectures: s.lectures.map((l) => ({
        ...l,
        active: l.id === lecture.id,
        completed: l.id === lecture.id ? true : l.completed,
      })),
    }));
    setSections(updatedSections);
    calculateCompletionPercentage(updatedSections);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const tabs = ["Overview", "Lectures Notes", "Attach File", "Announcements"];

  return (
    <div className="container">
      {/* Course Header */}
      <div className="course-header">
        <div className="course-info">
          <div className="play-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M14.5 3H9.5l-2 7h9l-2-7zM7 10l-4 11h18l-4-11H7z" />
            </svg>
          </div>
          <div className="course-details">
            <h1>{course.course_title}</h1>
            <div className="meta">
              <div className="meta-item">
                <svg fill="none" stroke="#f97316" viewBox="0 0 24 24">
                  <path strokeWidth="1.3" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6l4 2" />
                </svg>
                <span>{course.course_specification}</span>
              </div>
              <div className="meta-item">
                <svg fill="none" stroke="#4f46e5" viewBox="0 0 24 24">
                  <path strokeWidth="1.3" d="M12 4v16m-8-8h16" />
                </svg>
                <span>{sections.reduce((total, s) => total + s.lectures.length, 0)} lectures</span>
              </div>
              <div className="meta-item">
                <svg fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
                  <path strokeWidth="1.3" d="M12 2v10l4 2" />
                </svg>
                <span>{course.course_specification.split(",")[0].trim()}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="actions">
          <button className="review-btn">Write a Review</button>
          <button className="next-btn">Next Lecture</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content-parent">
        {/* Video and Description */}
        <div className="content-left">
          {/* Video Player */}
          <div className="video-container">
            <video
              className="video-player"
              src={activeLectureInfo.video}
              controls
              poster={course.course_image}
            >
              <source src={activeLectureInfo.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Lecture Info */}
          <div className="lecture-info">
            <h2>{activeLectureInfo.lectureTitle}</h2>
            <div className="lecture-meta">
              <div className="author">
                <img src="https://placehold.co/32x32" alt="Author" />
                <div>
                  <div className="by">by</div>
                  <div className="author-name">{course.author || "JDK"}</div>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={
                          i < Math.floor(course.course_rating || 0)
                            ? "star-filled"
                            : "star-empty"
                        }
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.5 3 1-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-3.5 4.5 1 5.5z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="updated">Last updated: Oct 26, 2020</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "tab active" : "tab"}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {tab === "Attach File" && <span className="file-count">01</span>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "Overview" && (
            <div className="tab-content">
              <h3>Overview</h3>
              <p>{course.course_description || "Master Java from basic to advanced..."}</p>
            </div>
          )}
          {activeTab === "Lectures Notes" && (
            <div className="tab-content">
              <h3>Lectures Notes</h3>
              <p>No lecture notes available.</p>
            </div>
          )}
          {activeTab === "Attach File" && (
            <div className="tab-content">
              <h3>Attach File</h3>
              <div className="file-item">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="file-icon"
                  style={{ width: "31px", height: "31px", color: "#f97316" }}
                >
                  <path strokeWidth="1.5" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                  <path strokeWidth="1.5" d="M14 2v6h6" />
                </svg>
                <span>Course Material.pdf</span>
                <button className="download-btn">Download File</button>
              </div>
            </div>
          )}
          {activeTab === "Announcements" && (
            <div className="tab-content">
              <h3>Announcements</h3>
              <p>No announcements available.</p>
            </div>
          )}
        </div>

        {/* Course Contents Sidebar */}
        <div className="sidebar">
          <div className="progress">
            <div className="progress-header">
              <h3>Contents</h3>
              <span className="progress-text">{completionPercentage}% Completed</span>
            </div>
            <div className="progress-bar">
              <div className="progress-filled" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>
          <div className="contents">
            {sections.map((section, index) => {
              const lectureCount = section.lectures.length;
              const totalDuration = section.lectures.reduce((total, lecture) => {
                const [h, m, s] = lecture.duration.split(":").map(Number);
                return total + h * 3600 + m * 60 + s;
              }, 0);
              const mins = Math.floor(totalDuration / 60);
              const secs = totalDuration % 60;
              const formattedDuration = `${mins}m ${secs}s`;

              return (
                <div key={section.id} className="section">
                  <div className="section-header" onClick={() => toggleSection(index)}>
                    <div className="section-title">
                      <svg
                        fill="none"
                        stroke="#f97316"
                        viewBox="0 0 24 24"
                        className={expandedSections[index] ? "rotate-90" : ""}
                      >
                        <path strokeWidth="1.5" d="M9 5l7 7-7 7" />
                      </svg>
                      <span>{section.section_title}</span>
                    </div>
                    <div className="section-meta">
                      <div className="meta-item">
                        <svg fill="none" stroke="#4f46e5" viewBox="0 0 24 24">
                          <path strokeWidth="1.3" d="M12 4v16m-8-8h16" />
                        </svg>
                        <span>{lectureCount} lectures</span>
                      </div>
                      <div className="meta-item">
                        <svg fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
                          <path strokeWidth="1.3" d="M12 2v10l4 2" />
                        </svg>
                        <span>{formattedDuration}</span>
                      </div>
                    </div>
                  </div>
                  {expandedSections[index] && (
                    <div className="lectures">
                      {section.lectures.map((lecture) => (
                        <div
                          key={lecture.id}
                          className={`lecture ${lecture.active ? "active" : ""}`}
                          onClick={() => handleLectureClick(section, lecture)}
                        >
                          <div className="lecture-info">
                            <div
                              className={`status ${
                                lecture.completed ? "completed" : lecture.active ? "active" : ""
                              }`}
                            >
                              {lecture.completed && (
                                <svg fill="none" stroke="white" viewBox="0 0 24 24">
                                  <path strokeWidth="1.5" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span>{lecture.title}</span>
                          </div>
                          <div className="lecture-time">
                            <svg fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>{lecture.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseVideoPage;
