import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const CourseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const course = location.state?.course;

  // Fallback (if user directly visits URL)
  if (!course) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col bg-[#f3f6fc]">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Course details not found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-[#204fb4] text-white px-4 py-2 rounded-lg hover:bg-[#183d8f]"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6fc] py-16">
      <div className="max-w-[1200px] mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <img
          src={course.img}
          alt={course.title}
          className="w-full h-[400px] object-cover"
        />

        <div className="p-10">
          <h1 className="text-4xl font-bold text-[#204fb4] mb-4">
            {course.title}
          </h1>

          <div className="flex flex-wrap gap-8 text-gray-700 mb-6">
            <p>
              <strong>Mode:</strong> {course.mode}
            </p>
            <p>
              <strong>Duration:</strong> {course.duration}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              <span className="text-[#204fb4] font-semibold">
                {course.price}
              </span>
            </p>
            <p>
              <strong>Availability:</strong>{" "}
              <span
                className={`font-semibold ${
                  course.availability === "Available"
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {course.availability}
              </span>
            </p>
          </div>

          <h2 className="text-2xl font-semibold mb-2">Course Structure</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {course.structure}
          </p>

          <h2 className="text-2xl font-semibold mb-2">Course Description</h2>
          <p className="text-gray-600 mb-10 leading-relaxed">
            {course.description}
          </p>

          <div className="flex gap-4">
            <button className="bg-[#204fb4] text-white px-6 py-3 rounded-lg hover:bg-[#183d8f] transition">
              Enroll Now
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
