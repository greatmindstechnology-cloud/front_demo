import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Star,
  Award,
  Search
} from "lucide-react";

const TrainerDashboard = () => {
  const [trainer, setTrainer] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  const handleLogout = (event) => {
    console.log("handleLogout triggered");
    event?.preventDefault();
    event?.stopPropagation();
    console.log("Logging out");
    // Navigate to login would happen here with router
    alert("Logout - Navigation would redirect to /Login");
  };

  useEffect(() => {
    const BASE_URL = "https://backend-demo-esqk.onrender.com";

    const fetchData = async () => {
      try {
        // Use stored credentials - in production get from auth context
        const email = localStorage.getItem("userEmail");
        console.log("Trainer email from localStorage:", email);
        const trainerId = localStorage.getItem("vendorId");
        console.log("Trainer ID from localStorage:", trainerId);

        if (!email || !trainerId) {
          throw new Error("Trainer email or ID not found");
        }

        const trainerResponse = await fetch(
          `${BASE_URL}/admin_gmt/trainer/?email=${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!trainerResponse.ok) {
          throw new Error(`Failed to fetch trainer data: ${trainerResponse.status}`);
        }

        const trainerData = await trainerResponse.json();

        if (trainerData.status !== "success") {
          throw new Error("Failed to fetch trainer data");
        }

        const fetchedTrainer = trainerData.data;

        const mappedTrainer = {
          ...fetchedTrainer,
          experience: fetchedTrainer.total_experience_years
            ? `${fetchedTrainer.total_experience_years} years`
            : "Not specified",
          courses: fetchedTrainer.courses_count || 0,
          profilePicture: fetchedTrainer.profile_picture
            ? `${BASE_URL}${fetchedTrainer.profile_picture}`
            : null,
          stepsCompleted: fetchedTrainer.steps_completed || 1,
          totalSteps: fetchedTrainer.total_steps || 4,
          progressPercentage: fetchedTrainer.progress_percentage || 25,
        };

        const coursesResponse = await fetch(
          `${BASE_URL}/trainer_gmt/trainer/courses/?trainer_id=${trainerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!coursesResponse.ok) {
          throw new Error(`Failed to fetch courses: ${coursesResponse.status}`);
        }

        const coursesData = await coursesResponse.json();

        if (!coursesData.courses) {
          throw new Error("Invalid courses response");
        }

        const mappedCourses = coursesData.courses.map((course) => ({
          id: course.id,
          title: course.title,
          author: `${coursesData.trainer.first_name} ${coursesData.trainer.last_name}`,
          rating: course.rating || 0,
          price: course.price || 0,
          image: course.image || "https://placehold.co/200x200",
          students: course.students_enrolled || 0,
        }));

        setTrainer(mappedTrainer);
        setCourses(mappedCourses);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <p className="text-red-600 font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const totalStudents = courses.reduce((sum, course) => sum + (course.students || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Good Morning</p>
              <h1 className="text-3xl font-bold text-gray-800 cursor-pointer hover:text-indigo-600 transition" onClick={handleLogout}>
                {trainer.first_name} {trainer.last_name}'s Dashboard
              </h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-50 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Created Courses</p>
                <p className="text-3xl font-bold text-gray-800">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start gap-4">
              <div className="bg-green-50 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Active Courses</p>
                <p className="text-3xl font-bold text-gray-800">{trainer.courses || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start gap-4">
              <div className="bg-purple-50 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Pending Course</p>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start gap-4">
              <div className="bg-orange-50 p-3 rounded-xl">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Students Enrolled</p>
                <p className="text-3xl font-bold text-gray-800">{totalStudents.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trainer Profile */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <img
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-indigo-100"
                  src={trainer?.profilePicture || "https://placehold.co/110x110"}
                  alt="Trainer"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/110x110";
                  }}
                />
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg">
                  {trainer.courses}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {trainer.first_name} {trainer.last_name}
                </h2>
                <p className="text-gray-600 mb-3">{trainer.email}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>{trainer.experience}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Profile Completion</span>
                <span className="text-sm font-bold text-indigo-600">
                  {trainer.stepsCompleted}/{trainer.totalSteps} Steps
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${trainer.progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                {trainer.progressPercentage}% Completed
              </p>
              <button
                onClick={() => alert("Navigate to edit profile")}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Edit Biography
              </button>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {trainer.first_name} Courses ({courses.length.toString().padStart(2, "0")})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{course.author}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{course.students}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-2xl font-bold text-indigo-600">
                        ₹{course.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-8">
                No courses available for this trainer.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;