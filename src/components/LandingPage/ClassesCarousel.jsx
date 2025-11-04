import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-0 md:-right-6 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-[#204fb4] hover:bg-[#183d8f] text-white p-3 md:p-4 rounded-full shadow-lg transition duration-300"
    onClick={onClick}
  >
    <FaChevronRight size={20} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-0 md:-left-6 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-[#204fb4] hover:bg-[#183d8f] text-white p-3 md:p-4 rounded-full shadow-lg transition duration-300"
    onClick={onClick}
  >
    <FaChevronLeft size={20} />
  </div>
);

const CourseCarousel = () => {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "Python Full Stack Development",
      img: "/img/python.jpg",
      mode: "Online & Offline",
      duration: "6 Months",
      price: "₹15,000",
      structure:
        "Frontend (React), Backend (Django), Database (PostgreSQL), API Integration, Deployment",
      description:
        "Master Full Stack Web Development using Python and Django. Build interactive frontends, scalable backends, and integrate APIs to deploy your projects end-to-end.",
      availability: "Available",
    },
    {
      id: 2,
      title: "Machine Learning Mastery",
      img: "/img/ml.jpg",
      mode: "Online Only",
      duration: "4 Months",
      price: "₹18,000",
      structure:
        "Python, Pandas, Scikit-learn, TensorFlow, Model Evaluation, Deployment",
      description:
        "Learn to build intelligent ML systems with hands-on projects. Understand algorithms, optimize models, and deploy real-world solutions.",
      availability: "Available",
    },
    {
      id: 3,
      title: "Advanced JavaScript Developer",
      img: "/img/javascript.jpg",
      mode: "Offline (Chennai)",
      duration: "3 Months",
      price: "₹12,000",
      structure:
        "ES6+, Node.js, Express, MongoDB, REST APIs, Async Programming",
      description:
        "Become a complete JavaScript developer by mastering both client and server-side programming using modern JS technologies.",
      availability: "Limited Seats",
    },
    {
      id: 4,
      title: "Data Analytics & Visualization",
      img: "/img/data.jpg",
      mode: "Online",
      duration: "5 Months",
      price: "₹14,000",
      structure:
        "Excel, Power BI, SQL, Python for Data Analysis, Reporting Dashboards",
      description:
        "Gain data-driven decision-making skills. Learn to collect, process, and visualize insights using top analytics tools.",
      availability: "Available",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const handleCardClick = (course) => {
    navigate(`/course/${course.id}`, { state: { course } });
  };

  return (
    <div className="w-full bg-[#f3f6fc] py-16 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-20 relative">
        <h2 className="text-4xl font-bold text-center mb-12">
          Explore Our{" "}
          <span className="text-[#204fb4]">Online & Offline Classes</span>
        </h2>

        {/* Slider Wrapper with extra padding and visible overflow */}
        <div
          className="relative"
          style={{
            paddingLeft: "40px",
            paddingRight: "40px",
            overflow: "visible",
          }}
        >
          <Slider
            {...settings}
            style={{
              overflow: "visible",
            }}
          >
            {courses.map((course) => (
              <div
                key={course.id}
                className="px-6"
                style={{
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              >
                <div
                  onClick={() => handleCardClick(course)}
                  className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-[1.03]"
                  style={{
                    transformOrigin: "center",
                  }}
                >
                  <img
                    src={course.img}
                    alt={course.title}
                    className="w-full h-[380px] object-cover"
                  />
                  <div className="p-6 flex flex-col justify-between h-[230px]">
                    <div>
                      <h3 className="text-2xl font-semibold text-[#204fb4] mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-1">
                        <strong>Mode:</strong> {course.mode}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <strong>Duration:</strong> {course.duration}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold text-[#204fb4]">
                        {course.price}
                      </span>
                      <button className="bg-[#204fb4] text-white px-4 py-2 rounded-lg hover:bg-[#183d8f] transition">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;
  ``