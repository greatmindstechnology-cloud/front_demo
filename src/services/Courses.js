import { React,useState } from 'react';
export const [courses,setCourses] = useState(
  []
);

(async () => {
  try {
    const response = await fetch('https://backend-demo-esqk.onrender.com/student_gmt/all-courses/');
    const data = await response.json();
    if (Array.isArray(data.courses)) {
      data.courses.forEach(course => {
        if (course.status === 'approved') {
            setCourses(prevCourses => [
            ...prevCourses,
            {
              id: course.course_id,
              title: course.course_title,
              category: course.course_description,
              rating: course.course_rating,
              price: course.course_price,
              linkImg: course.course_image,
            }
            ]);
        }
      });
      console.log(courses);
    } else {
      console.error('Error: Expected data to be an array, but received:', data);
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
})();