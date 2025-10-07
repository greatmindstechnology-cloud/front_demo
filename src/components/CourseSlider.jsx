import React from 'react';
import { useTheme } from '@mui/material';
import { Box, Typography, Card, CardContent, CardMedia, Button, LinearProgress, Grid } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Dummy course data (replace with API fetch in real app)
const dummyCourses = [
  {
    id: 1,
    name: 'Introduction to React',
    description: 'Learn the basics of React, including components, state, and props to build dynamic web applications.',
    duration: '4 hours',
    author: 'John Doe',
    image: 'https://th.bing.com/th/id/OIP.EeSr_Sp7tHyBlZwIg0bOgQHaEK?w=333&h=187&c=7&r=0&o=5&dpr=1.5&pid=1.7',
  },
  {
    id: 2,
    name: 'Advanced JavaScript',
    description: 'Master JavaScript with advanced topics like closures, async/await, and ES6+ features.',
    duration: '6 hours',
    author: 'Jane Smith',
    image: 'data:image/webp;base64,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',
  },
  {
    id: 3,
    name: 'UI/UX Design Principles',
    description: 'Discover user experience strategies, design fundamentals, and prototyping with modern tools.',
    duration: '5 hours',
    author: 'Alex Johnson',
    image: 'https://ut.uvt.tn/pluginfile.php/2147895/course/overviewfiles/Web-Thumbnail.jpg',
  },
  {
    id: 3,
    name: 'UI/UX Design Principles',
    description: 'Discover user experience strategies, design fundamentals, and prototyping with modern tools.',
    duration: '5 hours',
    author: 'Alex Johnson',
    image: 'https://ut.uvt.tn/pluginfile.php/2147895/course/overviewfiles/Web-Thumbnail.jpg',
  },
  {
    id: 3,
    name: 'UI/UX Design Principles',
    description: 'Discover user experience strategies, design fundamentals, and prototyping with modern tools.',
    duration: '5 hours',
    author: 'Alex Johnson',
    image: 'https://ut.uvt.tn/pluginfile.php/2147895/course/overviewfiles/Web-Thumbnail.jpg',
  },
  {
    id: 3,
    name: 'UI/UX Design Principles',
    description: 'Discover user experience strategies, design fundamentals, and prototyping with modern tools.',
    duration: '5 hours',
    author: 'Alex Johnson',
    image: 'https://ut.uvt.tn/pluginfile.php/2147895/course/overviewfiles/Web-Thumbnail.jpg',
  },
  {
    id: 3,
    name: 'UI/UX Design Principles',
    description: 'Discover user experience strategies, design fundamentals, and prototyping with modern tools.',
    duration: '5 hours',
    author: 'Alex Johnson',
    image: 'https://ut.uvt.tn/pluginfile.php/2147895/course/overviewfiles/Web-Thumbnail.jpg',
  },
];


const CourseSlider = () => {
  const theme = useTheme();

  const handleContinueLearning = (courseId) => {
    // Simulate navigation to course page
    alert(`Continuing learning for course ID: ${courseId}`);
    // navigate(`/course/${courseId}`);
  };

  // Slider settings for react-slick
  const settings = {
    dots: true,
    infinite: dummyCourses.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, dummyCourses.length),
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        py: 3,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          mb: 3,
          textAlign: 'center',
          fontSize: { xs: '1.8rem', sm: '2.2rem' },
          letterSpacing: 0.5,
        }}
      >
        My Courses
      </Typography>

      <Slider {...settings}>
        {dummyCourses.map((course) => (
          <Box key={course.id} sx={{ px: 1 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                bgcolor: 'white',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: 8,
                },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardMedia
                component="img"
                height="160"
                image={course.image}
                alt={course.name}
                sx={{
                  objectFit: 'cover',
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                }}
              />
              <CardContent
                sx={{
                  flexGrow: 1,
                  p: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      fontSize: '1.3rem',
                      color: theme.palette.primary.main,
                    }}
                  >
                    {course.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1.5,
                      fontSize: '0.95rem',
                      color: theme.palette.text.secondary,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {course.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontSize: '0.9rem',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <strong>Duration:</strong> {course.duration}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.9rem',
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                      }}
                    >
                      <strong>Progress:</strong> {course.progress}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: theme.palette.grey[300],
                        '& .MuiLinearProgress-bar': {
                          bgcolor: theme.palette.success.main,
                        },
                      }}
                    />
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleContinueLearning(course.id)}
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    py: 1.2,
                    fontSize: '0.95rem',
                    fontWeight: 'medium',
                    textTransform: 'none',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
                >
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default CourseSlider;