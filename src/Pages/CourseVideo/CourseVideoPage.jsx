// CourseVideoPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './CourseVideoPage.css';

// Constants
const BACKEND_BASE_URL = 'http://localhost:8000';
const TABS = ['Overview', 'Lecture Notes', 'Attachments', 'Announcements'];

// Utility function to format duration
const formatDuration = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}m ${secs}s`;
};

// Component
const CourseVideoPage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [activeLectureInfo, setActiveLectureInfo] = useState({
    sectionTitle: '',
    lectureTitle: '',
    video: '',
    progress: 0,
  });
  const [expandedSections, setExpandedSections] = useState({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [sections, setSections] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch course data
  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BACKEND_BASE_URL}/course_gmt/course/details/?course_id=${id}`, {
        timeout: 10000, // Add timeout for network requests
      });
      const fetchedCourse = res.data;

      if (!fetchedCourse?.sections) {
        throw new Error('Invalid course data structure');
      }

      setCourse(fetchedCourse);
      const parsedSections = fetchedCourse.sections || [];
      setSections(parsedSections);

      // Initialize expanded sections
      const initialExpanded = parsedSections.reduce((acc, _, index) => ({
        ...acc,
        [index]: false,
      }), {});
      setExpandedSections(initialExpanded);

      // Set initial active lecture
      const firstSectionWithLectures = parsedSections.find(
        (s) => s.lectures?.length > 0
      );
      const initialActive = firstSectionWithLectures?.lectures[0] || {};
      setActiveLectureInfo({
        sectionTitle: firstSectionWithLectures?.section_title || '',
        lectureTitle: initialActive.title || '',
        video: initialActive.video_file ? `${BACKEND_BASE_URL}${initialActive.video_file}` : '',
        progress: initialActive.progress || 0,
      });

      // Update sections with active/completed status
      const updatedSections = parsedSections.map((s) => ({
        ...s,
        lectures: s.lectures.map((l, i) => ({
          ...l,
          active: i === 0 && s.id === firstSectionWithLectures?.id,
          video_file: l.video_file ? `${BACKEND_BASE_URL}${l.video_file}` : '',
          completed: l.completed || false,
          progress: l.progress || 0,
        })),
      }));
      setSections(updatedSections);
      calculateCompletionPercentage(updatedSections);
    } catch (err) {
      setError(err.message || 'Failed to fetch course data');
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Calculate completion percentage
  const calculateCompletionPercentage = useCallback((sectionsData) => {
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
  }, []);

  // Toggle section expansion
  const toggleSection = useCallback((sectionIndex) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  }, []);

  // Handle lecture selection
  const handleLectureClick = useCallback((section, lecture) => {
    setActiveLectureInfo({
      sectionTitle: section.section_title,
      lectureTitle: lecture.title,
      video: lecture.video_file || '',
      progress: lecture.progress || 0,
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

    // Persist completion status to backend
    axios.patch(`${BACKEND_BASE_URL}/course_gmt/lecture/${lecture.id}/`, {
      completed: true,
    }).catch((err) => console.error('Failed to update lecture completion:', err));
  }, [sections, calculateCompletionPercentage]);

  // Handle video progress
  const handleVideoProgress = useCallback((e) => {
    const video = e.target;
    const progress = (video.currentTime / video.duration) * 100;
    setActiveLectureInfo((prev) => ({ ...prev, progress }));

    // Update progress in sections state
    const updatedSections = sections.map((s) => ({
      ...s,
      lectures: s.lectures.map((l) =>
        l.title === activeLectureInfo.lectureTitle
          ? { ...l, progress, completed: progress >= 90 }
          : l
      ),
    }));
    setSections(updatedSections);
    calculateCompletionPercentage(updatedSections);
  }, [activeLectureInfo, sections, calculateCompletionPercentage]);

  // Navigate to next lecture
  const handleNextLecture = useCallback(() => {
    const flatLectures = sections.flatMap((s) => s.lectures.map((l) => ({ ...l, section: s })));
    const currentIndex = flatLectures.findIndex(
      (l) => l.title === activeLectureInfo.lectureTitle
    );
    if (currentIndex < flatLectures.length - 1) {
      const nextLecture = flatLectures[currentIndex + 1];
      handleLectureClick(nextLecture.section, nextLecture);
    }
  }, [activeLectureInfo, sections, handleLectureClick]);

  // Fetch course on mount
  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // Memoize total lectures and duration
  const { totalLectures, totalDuration } = useMemo(() => {
    const lectures = sections.reduce((total, s) => total + s.lectures.length, 0);
    const duration = sections.reduce((total, section) => {
      return total + section.lectures.reduce((sum, lecture) => {
        const [h, m, s] = lecture.duration.split(':').map(Number);
        return sum + h * 3600 + m * 60 + s;
      }, 0);
    }, 0);
    return { totalLectures: lectures, totalDuration: formatDuration(duration) };
  }, [sections]);

  if (loading) {
    return <div className="loading" role="status">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error" role="alert">
        {error}
        <button onClick={fetchCourse} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="container" role="main">
      {/* Course Header */}
      <header className="course-header">
        <div className="course-info">
          <div className="play-icon" aria-hidden="true">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M14.5 3H9.5l-2 7h9l-2-7zM7 10l-4 11h18l-4-11H7z" />
            </svg>
          </div>
          <div className="course-details">
            <h1>{course.course_title}</h1>
            <div className="meta">
              <div className="meta-item">
                <svg fill="none" stroke="#f97316" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeWidth="1.3" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6l4 2" />
                </svg>
                <span>{course.course_specification}</span>
              </div>
              <div className="meta-item">
                <svg fill="none" stroke="#4f46e5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeWidth="1.3" d="M12 4v16m-8-8h16" />
                </svg>
                <span>{totalLectures} lectures</span>
              </div>
              <div className="meta-item">
                <svg fill="none" stroke="#f59e0b" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeWidth="1.3" d="M12 2v10l4 2" />
                </svg>
                <span>{totalDuration}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="actions">
          <button
            className="review-btn"
            onClick={() => navigate(``)}
            aria-label="Write a review for the course"
          >
            Write a Review
          </button>
          <button
            className="next-btn"
            onClick={handleNextLecture}
            aria-label="Go to next lecture"
          >
            Next Lecture
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content-parent">
        {/* Video and Description */}
        <section className="content-left">
          {/* Video Player */}
          <div className="video-container">
            <video
              className="video-player"
              src={activeLectureInfo.video}
              controls
              poster={course.course_image}
              onTimeUpdate={handleVideoProgress}
              aria-label={`Video player for ${activeLectureInfo.lectureTitle}`}
            >
              <source src={activeLectureInfo.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-progress">
              <span>Progress: {Math.round(activeLectureInfo.progress)}%</span>
            </div>
          </div>

          {/* Lecture Info */}
          <div className="lecture-info">
            <h2>{activeLectureInfo.lectureTitle}</h2>
            <div className="lecture-meta">
              <div className="author">
                <img
                  src={course.author_image }
                  alt={`Author ${course.author }`}
                  loading="lazy"
                />
                <div>
                  <div className="by">by</div>
                  <div className="author-name">{course.author || 'JDK'}</div>
                  <div className="rating" aria-label={`Course rating: ${course.course_rating || 0} stars`}>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={i < Math.floor(course.course_rating || 0) ? 'star-filled' : 'star-empty'}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M10 15l-5.5 3 1-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-3.5 4.5 1 5.5z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="updated">Last updated: {course.last_updated || 'Oct 26, 2020'}</div>
            </div>
          </div>

          {/* Tabs */}
          <nav className="tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`panel-${tab.toLowerCase().replace(' ', '-')}`}
              >
                {tab}
                {tab === 'Attachments' && <span className="file-count">01</span>}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'Overview' && (
              <div id="panel-overview" role="tabpanel">
                <h3>Overview</h3>
                <p>{course.course_description || 'No description available.'}</p>
              </div>
            )}
            {activeTab === 'Lecture Notes' && (
              <div id="panel-lecture-notes" role="tabpanel">
                <h3>Lecture Notes</h3>
                <p>{course.lecture_notes || 'No lecture notes available.'}</p>
              </div>
            )}
            {activeTab === 'Attachments' && (
              <div id="panel-attachments" role="tabpanel">
                <h3>Attachments</h3>
                <div className="file-item">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="file-icon"
                    style={{ width: '31px', height: '31px', color: '#f97316' }}
                    aria-hidden="true"
                  >
                    <path strokeWidth="1.5" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                    <path strokeWidth="1.5" d="M14 2v6h6" />
                  </svg>
                  <span>Course Material.pdf</span>
                  <button
                    className="download-btn"
                    onClick={() => window.open(`${BACKEND_BASE_URL}/files/course-material.pdf`, '_blank')}
                    aria-label="Download course material"
                  >
                    Download File
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'Announcements' && (
              <div id="panel-announcements" role="tabpanel">
                <h3>Announcements</h3>
                <p>{course.announcements || 'No announcements available.'}</p>
              </div>
            )}
          </div>
        </section>

        {/* Course Contents Sidebar */}
        <aside className="sidebar">
          <div className="progress">
            <div className="progress-header">
              <h3>Contents</h3>
              <span className="progress-text" aria-live="polite">
                {completionPercentage}% Completed
              </span>
            </div>
            <div className="progress-bar" role="progressbar" aria-valuenow={completionPercentage} aria-valuemin="0" aria-valuemax="100">
              <div className="progress-filled" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>
          <div className="contents">
            {sections.map((section, index) => {
              const lectureCount = section.lectures.length;
              const totalDuration = formatDuration(
                section.lectures.reduce((total, lecture) => {
                  const [h, m, s] = lecture.duration.split(':').map(Number);
                  return total + h * 3600 + m * 60 + s;
                }, 0)
              );

              return (
                <div key={section.id} className="section">
                  <button
                    className="section-header"
                    onClick={() => toggleSection(index)}
                    aria-expanded={expandedSections[index]}
                    aria-controls={`section-${section.id}`}
                  >
                    <div className="section-title">
                      <svg
                        fill="none"
                        stroke="#f97316"
                        viewBox="0 0 24 24"
                        className={expandedSections[index] ? 'rotate-90' : ''}
                        aria-hidden="true"
                      >
                        <path strokeWidth="1.5" d="M9 5l7 7-7 7" />
                      </svg>
                      <span>{section.section_title}</span>
                    </div>
                    <div className="section-meta">
                      <div className="meta-item">
                        <svg fill="none" stroke="#4f46e5" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeWidth="1.3" d="M12 4v16m-8-8h16" />
                        </svg>
                        <span>{lectureCount} lectures</span>
                      </div>
                      <div className="meta-item">
                        <svg fill="none" stroke="#f59e0b" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeWidth="1.3" d="M12 2v10l4 2" />
                        </svg>
                        <span>{totalDuration}</span>
                      </div>
                    </div>
                  </button>
                  {expandedSections[index] && (
                    <div className="lectures" id={`section-${section.id}`}>
                      {section.lectures.map((lecture) => (
                        <button
                          key={lecture.id}
                          className={`lecture ${lecture.active ? 'active' : ''}`}
                          onClick={() => handleLectureClick(section, lecture)}
                          aria-current={lecture.active ? 'true' : 'false'}
                          aria-label={`Play lecture: ${lecture.title}`}
                        >
                          <div className="lecture-info">
                            <div
                              className={`status ${
                                lecture.completed ? 'completed' : lecture.active ? 'active' : ''
                              }`}
                              aria-label={lecture.completed ? 'Lecture completed' : 'Lecture not completed'}
                            >
                              {lecture.completed && (
                                <svg fill="none" stroke="white" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeWidth="1.5" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span>{lecture.title}</span>
                          </div>
                          <div className="lecture-time">
                            <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>{lecture.duration}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};

// PropTypes for type checking
CourseVideoPage.propTypes = {
  id: PropTypes.string,
};

export default CourseVideoPage;