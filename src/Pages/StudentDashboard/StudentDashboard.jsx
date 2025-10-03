import React from 'react';
import { useState, useEffect } from 'react';
import './StudentDashboard.css';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Footer from '../../components/Footer/Footer';
import CourseCard from '../../components/CourseCard/CourseCard';
import { useNavigate } from "react-router-dom";
import emptyProfileImg from '../../assets/emptyprofile.png';

const StudentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    setErrors([]);

    // Retrieve the user email from localStorage
    const userEmail = localStorage.getItem('userEmail');
    console.log('Retrieved User Email from localStorage:', userEmail);

    if (!userEmail) {
      console.error('No User Email found in localStorage. Using fallback data.');
      setErrors(prev => [...prev, 'User Email not found. Please log in again.']);
      setUserData({ name: 'Guest', email: 'N/A', skills: [] });
    }
    const trainerId = localStorage.getItem('userEmail');
    const BASE_URL = 'http://localhost:8000';
    // Fetch user data by sending the email as a query parameter
    const fetchUserData = trainerId
      ? fetch(`http://localhost:8000/admin_gmt/student/?email=${trainerId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            console.log('Fetching student data for email:', trainerId);
            console.log('Raw Response:', res);
            console.log('Fetch Student Data - Response Status:', res.status, res.statusText);
            if (!res.ok) {
              return res.json().then(errData => {
                throw new Error(`Failed to fetch student data: ${res.status} ${res.statusText} - ${errData.message || 'No message'}`);
              });
            }
            return res.json();
          })
          .then(response => {
            console.log('Parsed Student Data:', response);
            if (response.status === 'success' && response.data) {
              const mappedUserData = {
                name: `${response.data.firstname} ${response.data.lastname}`.trim() || 'Unknown User',
                email: response.data.email || 'N/A',
                skills: typeof response.data.skills === 'string' && response.data.skills
                  ? response.data.skills.split(',').map(skill => skill.trim())
                  : [],
                profilePicture: response.data.profile_picture
                  ? `${BASE_URL}${response.data.profile_picture}`
                  : null,
              };
              console.log('Mapped Student Data:', mappedUserData);
              setUserData(mappedUserData);
            } else {
              throw new Error('Invalid response structure for student data: Expected status "success" and a data object');
            }
          })
          .catch(err => {
            console.error('Error fetching student data:', err.message);
            setErrors(prev => [...prev, err.message]);
            setUserData({ name: 'Guest', email: 'N/A', skills: [], profilePicture: null });
          })
      : Promise.resolve();

    const fetchCourses = fetch('http://localhost:8000/student_gmt/all-courses/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        console.log('Raw API Response for Courses:', data);
        // Map the API response to match the expected fields
        const mappedCourses = (data.courses || []).map(course => ({
          id: course.course_id,
          title: course.course_title,
          image: course.course_image,
          price: course.course_price,
          description: course.course_description,
          rating: course.course_rating,
        }));
        setCourses(mappedCourses);
      })
      .catch(err => {
        console.error('Error fetching courses:', err);
        setErrors(prev => [...prev, err.message]);
        setCourses([]);
      });

    const fetchDashboardStats = fetch('http://localhost:8000/api/dashboard-stats/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('');
        return res.json();
      })
      .then(data => {
        console.log('Raw API Response for Dashboard Stats:', data);
        setDashboardStats(data || { enrolledCourses: 0, activeCourses: 0, completedCourses: 0, courseInstructors: 0 });
      })
      .catch(err => {
        console.error('Error fetching dashboard stats:', err);
        setErrors(prev => [...prev, err.message]);
        setDashboardStats({
          enrolledCourses: 0,
          activeCourses: 0,
          completedCourses: 0,
          courseInstructors: 0,
        });
      });

    Promise.allSettled([fetchUserData, fetchCourses, fetchDashboardStats])
      .finally(() => setLoading(false));
  }, []);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 0));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil((courses?.length || 0) / 4) - 1));

  const handleCourseClick = (courseId) => {
    navigate(`/dashboard/course/${courseId}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <div className="welcome-section">
          <div className="welcome-bg"></div>
          <div className="welcome-content">
            <button onClick={() => navigate('/dashboard/editform')} className="edit-button">
              Edit Profile ✏️
            </button>
            <img
              className="user-pic"
              src={
                userData?.profilePicture
                  ? userData.profilePicture
                  : emptyProfileImg
              }
              alt="User"
              onError={(e) => {
                e.target.onerror = null;
              }}
            />
            <div className="welcome-text">
              <h1>
                Hello, <span>{userData?.name || 'Guest'}</span>
              </h1>
              <p>Start your journey here</p>
            </div>
          </div>
        </div>

        <section className="dashboard-stats">
          <h2>Dashboard</h2>
            {[
              { label: 'Enrolled Courses', value: dashboardStats?.enrolledCourses ?? 0, color: '#f97316', icon: <EditIcon style={{ color: '#f97316' }} /> },
              { label: 'Active Courses', value: dashboardStats?.activeCourses ?? 0, color: '#4f46e5', icon: <AddIcon style={{ color: '#4f46e5' }} /> },
              { label: 'Completed Courses', value: dashboardStats?.completedCourses ?? 0, color: '#16a34a', icon: <CheckCircleIcon style={{ color: '#16a34a' }} /> },
              { label: 'Course Instructors', value: dashboardStats?.courseInstructors ?? 0, color: '#d97706', icon: <PeopleIcon style={{ color: '#d97706' }} /> },
            ].map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon" style={{ borderColor: stat.color, backgroundColor: `${stat.color}33` }}>
                  {stat.icon}
                </div>
                <div className="stat-info">
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
        </section>

        <section className="course-list">
          <div className="course-header">
            <h2>Let’s start learning, {userData?.name?.split(' ')[0] || 'Guest'}</h2>
            <div className="pagination">
              <button onClick={handlePrevPage} className="pagination-btn prev" disabled={currentPage === 0}>
                <ArrowBackIosIcon />
              </button>
              <button onClick={handleNextPage} className="pagination-btn next" disabled={currentPage >= Math.ceil((courses?.length || 0) / 4) - 1}>
                <ArrowForwardIosIcon />
              </button>
            </div>
          </div>
          <div className="courses-grid">
            {courses?.length > 0 ? (
              courses.slice(currentPage * 4, (currentPage + 1) * 4).map(course => (
                <div
                  key={course.id}
                  onClick={() => handleCourseClick(course.id)}
                  style={{ cursor: 'pointer' }} // Add cursor pointer for better UX
                >
                <CourseCard
                  key={course.id}
                  course={{
                    id: course.id,
                    title: course.title,
                    price: course.price || 'Not specified',
                    image: course.image,
                    description: course.description || 'No description available',
                    rating: course.rating || 0,
                  }}
                />
                </div>
              ))
            ) : (
              <p>No courses available at the moment.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StudentDashboard;



// import React, { useState, useEffect } from 'react';
// import './StudentDashboard.css';
// import EditIcon from '@mui/icons-material/Edit';
// import AddIcon from '@mui/icons-material/Add';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import PeopleIcon from '@mui/icons-material/People';
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import Footer from '../../components/Footer/Footer';
// import CourseCard from '../../components/CourseCard/CourseCard';
// import { useNavigate } from 'react-router-dom';

// const StudentDashboard = () => {
//   const [userData, setUserData] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [dashboardStats, setDashboardStats] = useState(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setLoading(true);
//     setErrors([]);

//     const userEmail = localStorage.getItem('userEmail');
//     console.log('Retrieved User Email from localStorage:', userEmail);

//     if (!userEmail) {
//       console.error('No User Email found in localStorage. Using fallback data.');
//       setErrors(prev => [...prev, 'User Email not found. Please log in again.']);
//       setUserData({ name: 'Guest', email: 'N/A', skills: [], profilePicture: null });
//     }

//     const BASE_URL = 'http://localhost:8000';
//     const DEFAULT_IMAGE = '/images/fallback.jpg';

//     const fetchUserData = userEmail
//       ? fetch(`http://localhost:8000/admin_gmt/student/?email=${userEmail}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//         .then(res => {
//           console.log('Fetching student data for email:', userEmail);
//           console.log('Fetch Student Data - Response Status:', res.status, res.statusText);
//           if (!res.ok) {
//             return res.json().then(errData => {
//               throw new Error(`Failed to fetch student data: ${res.status} ${res.statusText} - ${errData.message || 'No message'}`);
//             });
//           }
//           return res.json();
//         })
//         .then(response => {
//           console.log('Parsed Student Data:', response);
//           if (response.status === 'success' && response.data) {
//             const mappedUserData = {
//               name: `${response.data.firstname} ${response.data.lastname}`.trim() || 'Unknown User',
//               email: response.data.email || 'N/A',
//               skills: typeof response.data.skills === 'string' && response.data.skills
//                 ? response.data.skills.split(',').map(skill => skill.trim())
//                 : [],
//               profilePicture: response.data.profile_picture
//                 ? `${BASE_URL}/${response.data.profile_picture.replace(/^\/+/, '')}`
//                 : DEFAULT_IMAGE,
//             };
//             console.log('Mapped Student Data:', mappedUserData);
//             setUserData(mappedUserData);
//           } else {
//             throw new Error('Invalid response structure for student data: Expected status "success" and a data object');
//           }
//         })
//         .catch(err => {
//           console.error('Error fetching student data:', err.message);
//           setErrors(prev => [...prev, err.message]);
//           setUserData({ name: 'Guest', email: 'N/A', skills: [], profilePicture: DEFAULT_IMAGE });
//         })
//       : Promise.resolve();

//     const fetchCourses = fetch('http://localhost:8000/student_gmt/all-courses/', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then(res => {
//         if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status} ${res.statusText}`);
//         return res.json();
//       })
//       .then(data => {
//         console.log('Raw API Response for Courses:', data);
//         const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
//         const mappedCourses = (data.courses || [])
//           .filter(course => course.status === 'approved')
//           .map(course => {
//             console.log(`Course ID ${course.course_id} course_image:`, course.course_image);
//             let imageUrl = DEFAULT_IMAGE;
//             if (course.course_image) {
//               const cleanPath = course.course_image.replace(/^\/+/, '');
//               const isValidImage = validImageExtensions.some(ext => cleanPath.toLowerCase().endsWith(ext));
//               if (isValidImage) {
//                 imageUrl = `${BASE_URL}/${cleanPath}`;
//               } else {
//                 console.warn(`Invalid image format for course ID ${course.course_id}: ${cleanPath}`);
//               }
//             } else {
//               console.warn(`Course ID ${course.course_id} has no image. Using fallback: ${DEFAULT_IMAGE}`);
//             }

//             return {
//               id: course.course_id,
//               title: course.course_title,
//               image: imageUrl,
//               price: course.course_price,
//               description: course.course_description,
//               rating: course.course_rating,
//             };
//           });

//         setCourses(mappedCourses);
//         console.log('Mapped Courses:', mappedCourses);
//       })
//       .catch(err => {
//         console.error('Error fetching courses:', err.message);
//         setErrors(prev => [...prev, err.message]);
//         setCourses([]);
//       });

//     const fetchDashboardStats = fetch('http://localhost:8000/api/dashboard-stats/', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then(res => {
//         if (!res.ok) throw new Error(`Failed to fetch dashboard stats: ${res.status} ${res.statusText}`);
//         return res.json();
//       })
//       .then(data => {
//         console.log('Raw API Response for Dashboard Stats:', data);
//         setDashboardStats(data || { enrolledCourses: 0, activeCourses: 0, completedCourses: 0, courseInstructors: 0 });
//       })
//       .catch(err => {
//         console.error('Error fetching dashboard stats:', err.message);
//         setErrors(prev => [...prev, err.message]);
//         setDashboardStats({
//           enrolledCourses: 0,
//           activeCourses: 0,
//           completedCourses: 0,
//           courseInstructors: 0,
//         });
//       });

//     Promise.allSettled([fetchUserData, fetchCourses, fetchDashboardStats])
//       .finally(() => setLoading(false));
//   }, []);

//   const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 0));
//   const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil((courses?.length || 0) / 4) - 1));

//   const handleCourseClick = (courseId) => {
//     navigate(`/dashboard/course/${courseId}`);
//   };

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="dashboard-container">
//       {errors.length > 0 && (
//         <div className="error-messages" style={{ color: 'red', margin: '10px 0' }}>
//           {errors.map((error, index) => (
//             <p key={index}>{error}</p>
//           ))}
//         </div>
//       )}
//       <main className="main-content">
//         <div className="welcome-section">
//           <div className="welcome-bg"></div>
//           <div className="welcome-content">
//             <button onClick={() => navigate('/dashboard/editform')} className="edit-button">
//               Edit Profile ✏️
//             </button>
//             <img
//               className="user-pic"
//               src={userData?.profilePicture || '/images/fallback.jpg'}
//               alt="User"
//               onError={(e) => {
//                 e.target.src = '/images/fallback.jpg';
//               }}
//             />
//             <div className="welcome-text">
//               <h1>
//                 Hello, <span>{userData?.name || 'Guest'}</span>
//               </h1>
//               <p>Start your journey here</p>
//             </div>
//           </div>
//         </div>

//         <section className="dashboard-stats">
//           <h2>Dashboard</h2>
//           {[
//             { label: 'Enrolled Courses', value: dashboardStats?.enrolledCourses ?? 0, color: '#f97316', icon: <EditIcon style={{ color: '#f97316' }} /> },
//             { label: 'Active Courses', value: dashboardStats?.activeCourses ?? 0, color: '#4f46e5', icon: <AddIcon style={{ color: '#4f46e5' }} /> },
//             { label: 'Completed Courses', value: dashboardStats?.completedCourses ?? 0, color: '#16a34a', icon: <CheckCircleIcon style={{ color: '#16a34a' }} /> },
//             { label: 'Course Instructors', value: dashboardStats?.courseInstructors ?? 0, color: '#d97706', icon: <PeopleIcon style={{ color: '#d97706' }} /> },
//           ].map((stat, index) => (
//             <div key={index} className="stat-card">
//               <div className="stat-icon" style={{ borderColor: stat.color, backgroundColor: `${stat.color}33` }}>
//                 {stat.icon}
//               </div>
//               <div className="stat-info">
//                 <p className="stat-value">{stat.value}</p>
//                 <p className="stat-label">{stat.label}</p>
//               </div>
//             </div>
//           ))}
//         </section>

//         <section className="course-list">
//           <div className="course-header">
//             <h2>Let’s start learning, {userData?.name?.split(' ')[0] || 'Guest'}</h2>
//             <div className="pagination">
//               <button onClick={handlePrevPage} className="pagination-btn prev" disabled={currentPage === 0}>
//                 <ArrowBackIosIcon />
//               </button>
//               <button onClick={handleNextPage} className="pagination-btn next" disabled={currentPage >= Math.ceil((courses?.length || 0) / 4) - 1}>
//                 <ArrowForwardIosIcon />
//               </button>
//             </div>
//           </div>
//           <div className="courses-grid">
//             {courses?.length > 0 ? (
//               courses.slice(currentPage * 4, (currentPage + 1) * 4).map(course => (
//                 <div
//                   key={course.id}
//                   onClick={() => handleCourseClick(course.id)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   <CourseCard
//                     course={{
//                       id: course.id,
//                       title: course.title,
//                       price: course.price || 'Not specified',
//                       image: course.image,
//                       description: course.description || 'No description available',
//                       rating: course.rating || 0,
//                     }}
//                   />
//                 </div>
//               ))
//             ) : (
//               <p>No courses available at the moment.</p>
//             )}
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default StudentDashboard;