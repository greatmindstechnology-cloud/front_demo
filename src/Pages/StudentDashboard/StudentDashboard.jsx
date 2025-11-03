import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Skeleton,
  Alert,
  IconButton,
  Chip,
  Stack,
  LinearProgress,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  MenuBook as MenuBookIcon,
  EmojiEvents as EmojiEventsIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import Footer from '../../components/Footer/Footer';
import CourseCard from '../../components/CourseCard/CourseCard';
import CourseSlider from '../../components/CourseSlider';
import emptyProfileImg from '../../assets/emptyprofile.png';

const StudentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

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
    const BASE_URL = 'https://backend-demo-esqk.onrender.com';

    // Fetch user data by sending the email as a query parameter
    const fetchUserData = trainerId
      ? fetch(`https://backend-demo-esqk.onrender.com/admin_gmt/student/?email=${trainerId}`, {
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

    const fetchCourses = fetch('https://backend-demo-esqk.onrender.com/student_gmt/all-courses/', {
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

    const fetchDashboardStats = fetch('https://backend-demo-esqk.onrender.com/api/dashboard-stats/', {
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

  const getStatIcon = (index) => {
    const icons = [MenuBookIcon, TrendingUpIcon, EmojiEventsIcon, PeopleIcon];
    const IconComponent = icons[index];
    return <IconComponent />;
  };

  const getStatColor = (index) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.warning.main
    ];
    return colors[index];
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 3, mb: 3 }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
      

        {/* Welcome Header Section */}
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            mb: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DashboardIcon 
                      sx={{ 
                        fontSize: 40, 
                        color: theme.palette.primary.main, 
                        mr: 2 
                      }} 
                    />
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2
                      }}
                    >
                      Learning Dashboard
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 1,
                        lineHeight: 1.3
                      }}
                    >
                      Welcome back, <span style={{ color: theme.palette.primary.main }}>
                        {userData?.name?.split(' ')[0] || 'Guest'}
                      </span>
                    </Typography>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
                      Continue your learning journey and achieve your goals
                    </Typography>
                  </Box>

                  {userData?.skills && userData.skills.length > 0 && (
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2, fontWeight: 500 }}
                      >
                        Your Skills:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {userData.skills.slice(0, 5).map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            variant="outlined"
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main,
                              mb: 1
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Box>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => navigate('/dashboard/editform')}
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        boxShadow: theme.shadows[4],
                        '&:hover': {
                          boxShadow: theme.shadows[8],
                        }
                      }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: { xs: 'center', md: 'flex-end' },
                    alignItems: 'center',
                    height: '100%'
                  }}
                >
                  <Paper
                    elevation={8}
                    sx={{
                      p: 1,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
                    }}
                  >
                    <Avatar
                      src={userData?.profilePicture || emptyProfileImg}
                      sx={{
                        width: 120,
                        height: 120,
                        border: `4px solid ${theme.palette.background.paper}`
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = emptyProfileImg;
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Course Slider */}
        <Box sx={{ mb: 4 }}>
          <CourseSlider />
        </Box>

        {/* Dashboard Statistics */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            mb: 4,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Stack spacing={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 2 }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3
                }}
              >
                Academic Overview
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {[
                { 
                  label: 'Enrolled Courses', 
                  value: dashboardStats?.enrolledCourses ?? 0, 
                  description: 'Total courses you\'re enrolled in',
                  progress: 75
                },
                { 
                  label: 'Active Courses', 
                  value: dashboardStats?.activeCourses ?? 0, 
                  description: 'Courses currently in progress',
                  progress: 60
                },
                { 
                  label: 'Completed Courses', 
                  value: dashboardStats?.completedCourses ?? 0, 
                  description: 'Successfully completed courses',
                  progress: 90
                },
                { 
                  label: 'Course Instructors', 
                  value: dashboardStats?.courseInstructors ?? 0, 
                  description: 'Expert instructors teaching you',
                  progress: 100
                }
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <Card
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                        borderColor: getStatColor(index)
                      }
                    }}
                  >
                    <Stack spacing={2} sx={{ height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(getStatColor(index), 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {React.cloneElement(getStatIcon(index), {
                            sx: { fontSize: 24, color: getStatColor(index) }
                          })}
                        </Paper>
                      </Box>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 800,
                            color: getStatColor(index),
                            mb: 1,
                            lineHeight: 1
                          }}
                        >
                          {stat.value}
                        </Typography>
                        
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 1,
                            lineHeight: 1.3
                          }}
                        >
                          {stat.label}
                        </Typography>
                        
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ 
                            mb: 2, 
                            lineHeight: 1.4,
                            minHeight: '2.8em' // Ensure consistent height
                          }}
                        >
                          {stat.description}
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={stat.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(getStatColor(index), 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getStatColor(index),
                            borderRadius: 3
                          }
                        }}
                      />
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Paper>

        {/* Course Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            mb: 4,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Stack spacing={4}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 1,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.3
                  }}
                >
                  Continue Learning, {userData?.name?.split(' ')[0] || 'Guest'}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 500, lineHeight: 1.5 }}
                >
                  Explore courses tailored to your interests and career goals
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}
                >
                  Page {currentPage + 1} of {Math.ceil((courses?.length || 0) / 4) || 1}
                </Typography>
                
                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    sx={{
                      bgcolor: alpha(theme.palette.action.hover, 0.5),
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.action.selected, 0.8),
                        transform: 'scale(1.05)'
                      },
                      '&.Mui-disabled': { 
                        opacity: 0.3,
                        bgcolor: alpha(theme.palette.action.hover, 0.2)
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  
                  <IconButton
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil((courses?.length || 0) / 4) - 1}
                    sx={{
                      bgcolor: alpha(theme.palette.action.hover, 0.5),
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.action.selected, 0.8),
                        transform: 'scale(1.05)'
                      },
                      '&.Mui-disabled': { 
                        opacity: 0.3,
                        bgcolor: alpha(theme.palette.action.hover, 0.2)
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </Stack>
              </Box>
            </Box>

            <Divider />

            {courses?.length > 0 ? (
              <Grid container spacing={3}>
                {courses.slice(currentPage * 4, (currentPage + 1) * 4).map(course => (
                  <Grid item xs={12} sm={6} lg={3} key={course.id}>
                    <Box
                      onClick={() => handleCourseClick(course.id)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        '&:hover': { 
                          transform: 'scale(1.02)',
                        },
                        height: '100%',
                        display: 'flex'
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <CourseCard
                          course={{
                            id: course.id,
                            title: course.title,
                            price: course.price || 'Not specified',
                            image: course.image,
                            description: course.description || 'No description available',
                            rating: course.rating || 0,
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `2px dashed ${alpha(theme.palette.divider, 0.5)}`
                }}
              >
                <MenuBookIcon sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                  No courses available at the moment
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                  Check back later for new learning opportunities
                </Typography>
              </Paper>
            )}
          </Stack>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default StudentDashboard;