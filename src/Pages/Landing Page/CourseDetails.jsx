import React from "react";

const CourseDetails = ({ course }) => {
  // Sample fallback if no course prop is passed (for standalone preview)
  const selectedCourse =
    course || {
      id: 1,
      name: "Python Full Stack",
      mode: "Online & Offline",
      duration: "6 Months",
      structure: [
        "Frontend: HTML, CSS, JavaScript, React",
        "Backend: Python (Django Framework)",
        "Database: PostgreSQL",
        "Deployment: Docker, AWS Basics",
      ],
      description:
        "This Python Full Stack program is designed to make you industry-ready. Learn how to build end-to-end web applications using Python and Django, connect them with powerful databases, and deploy your projects to the cloud. Get hands-on project experience and mentorship from industry experts.",
      price: "₹15,000",
      image: "/img/python-fullstack.jpg",
      availability: "Batch starts every month",
      trainer: {
        name: "Mr. Rajesh Kumar",
        experience: "8+ Years in Full Stack Development",
        profilePic: "/img/trainer.jpg",
      },
    };

  return (
    <div className="w-full bg-[#f3f6fc] min-h-screen pb-20">
      {/* ===== Hero Section ===== */}
      <div className="relative w-full h-[350px]">
        <img
          src={selectedCourse.image}
          alt={selectedCourse.name}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-[#204fb4]/80 flex flex-col justify-center items-start px-10 md:px-24 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {selectedCourse.name}
          </h1>
          <p className="text-lg md:text-xl mb-1">
            Mode: <span className="font-semibold">{selectedCourse.mode}</span>
          </p>
          <p className="text-lg mb-4">
            Duration: <span className="font-semibold">{selectedCourse.duration}</span>
          </p>
          <button className="bg-white text-[#204fb4] font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-gray-100 transition-all">
            Enroll Now
          </button>
        </div>
      </div>

      {/* ===== Course Overview Section ===== */}
      <div className="max-w-[1200px] mx-auto px-6 mt-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#204fb4] mb-4">
            Course Overview
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {selectedCourse.description}
          </p>
        </div>

        {/* ===== Course Structure ===== */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">
          <h2 className="text-3xl font-bold text-[#204fb4] mb-6">
            Course Structure
          </h2>
          <ul className="space-y-4">
            {selectedCourse.structure.map((item, index) => (
              <li
                key={index}
                className="bg-[#f3f6fc] p-4 rounded-lg text-gray-700 text-md border-l-4 border-[#204fb4]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Availability Section ===== */}
        <div className="bg-[#204fb4] text-white rounded-2xl p-8 mt-10 shadow-lg">
          <h2 className="text-3xl font-bold mb-3">Availability</h2>
          <p className="text-lg">{selectedCourse.availability}</p>
          <p className="text-lg mt-2">
            <span className="font-semibold">Mode:</span> {selectedCourse.mode}
          </p>
        </div>

        {/* ===== Trainer Section ===== */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10 flex flex-col md:flex-row items-center gap-6">
          <img
            src={selectedCourse.trainer.profilePic}
            alt={selectedCourse.trainer.name}
            className="w-32 h-32 object-cover rounded-full border-4 border-[#204fb4]"
          />
          <div>
            <h3 className="text-2xl font-bold text-[#204fb4] mb-1">
              Trainer: {selectedCourse.trainer.name}
            </h3>
            <p className="text-gray-700">{selectedCourse.trainer.experience}</p>
          </div>
        </div>
      </div>

      {/* ===== Sticky Buy Section ===== */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-2xl border-t border-gray-200 flex justify-between items-center px-8 py-4 z-50">
        <div>
          <h4 className="text-xl font-semibold text-[#204fb4]">
            {selectedCourse.name}
          </h4>
          <p className="text-gray-600">{selectedCourse.mode}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-[#204fb4]">
            {selectedCourse.price}
          </span>
          <button className="bg-[#204fb4] text-white px-6 py-3 rounded-xl hover:bg-[#183d8f] transition-all font-semibold">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
