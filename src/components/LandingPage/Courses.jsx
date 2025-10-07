import React from 'react';
import {useState,useEffect} from "react";
import Card from "./Card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import loader from '../../assets/bookloader.gif'; // Adjust the path as necessary

const Courses = ({ searchTerm }) => {
  const [courses,setCourses] = useState(
    []
  );
  const [loading, setLoading] = useState(true); 
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/student_gmt/all-courses/');
        const data = await response.json();
        console.log('Fetched courses:', data);
        if (Array.isArray(data.courses)) {
          const approvedCourses = data.courses
            .map(course => ({
              id: course.course_id,
              title: course.course_title,
              category: course.course_description,
              rating: course.course_rating,
              price: course.course_price,
              linkImg: course.course_image || 'https://via.placeholder.com/150', // Fallback to a placeholder image
            }));
          setCourses(approvedCourses);
          console.log('Approved courses:', courses);
        } else {
          console.error('Error: Expected data to be an array, but received:', data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
   const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  let settings = {
    dots: true,
    autoplay : true,
    autoplaySpeed: 2000,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[30vh]">
      <img src={loader} alt="Loading..." />
      </div>
    );
  }
  return (
    <div className="w-full bg-[#e9eff8b2] py-20">
      <div className=" md:max-w-[1480px] m-auto  px-4">
        <div className="py-4">
        <h1 className="py-3 text-3xl font-bold">Most Popular <span className="text-[#204fb4]">Courses</span></h1>
        </div>
    
    <div className="slick-slider px-5 slick-initialized">
    <Slider {...settings}>
          {
            filteredCourses.map((item,index)=>(
              <Card key={index} course={item}/>
            ))
          }
    </Slider>
    </div>
        
      </div>
    </div>
  );
};

export default Courses;
