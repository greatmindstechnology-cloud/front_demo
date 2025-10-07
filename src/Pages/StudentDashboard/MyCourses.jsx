import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Grid 
} from '@mui/material';
import { getStudentCourses, getMultipleCourses } from '../../services/CourseService'; // or appropriate path

const MyCourses = () => {
  const theme = useTheme();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const vendorId = localStorage.getItem('vendorId');
      if (!vendorId) return;

      try {
        // Fetch course IDs for the student
        const studentCoursesRes = await getStudentCourses(vendorId);
        console.log('Student Courses Response:', studentCoursesRes);
        const courseIds = studentCoursesRes.data.course_ids || []; // Assuming response has courseIds array

        if (courseIds.length > 0) {
          // Fetch multiple course details
          const multipleCoursesRes = await getMultipleCourses(courseIds);
          console.log('Multiple Courses Response:', multipleCoursesRes);
          setCourses(multipleCoursesRes.data.courses || []);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleStartLearning = (courseId) => {
    // Simulate navigation to course page
    alert(`Starting learning for course ID: ${courseId}`);
    // navigate(`/course/${courseId}`);
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        p: { xs: 2, sm: 3 },
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          mb: 3,
          textAlign: 'center',
          fontSize: { xs: '2rem', sm: '2.5rem' },
          letterSpacing: 0.5,
        }}
      >
        My Purchased Courses
      </Typography>

      <Grid container spacing={2}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.course_id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 6,
                bgcolor: 'white',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 12,
                },
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={course.course_image || 'https://via.placeholder.com/300x180?text=No+Image'}
                alt={course.course_title}
                sx={{
                  objectFit: 'cover',
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                }}
              />
              <CardContent
                sx={{
                  flexGrow: 1,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1.5,
                      fontSize: '1.5rem',
                      color: theme.palette.primary.main,
                    }}
                  >
                    {course.course_title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      fontSize: '1.1rem',
                      color: theme.palette.text.secondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {course.course_description || course.about_course || 'No description available'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontSize: '1rem',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <strong>Price:</strong> ₹{course.course_price}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontSize: '1rem',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <strong>Rating:</strong> {course.course_rating}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      fontSize: '1rem',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <strong>Author:</strong> {course.author_name || 'Unknown'}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleStartLearning(course.course_id)}
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'medium',
                    textTransform: 'none',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
                >
                  Start Course
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyCourses;