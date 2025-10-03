import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const courseId = localStorage.getItem('courseId');
  const navigate = useNavigate();

  useEffect(() => {
    if (courseId) {
      axios
        .get(`http://localhost:8000/course_gmt/get/${courseId}/projects/`)
        .then((res) => {
          setProjects(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching projects:", err);
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError("No course ID found in local storage.");
      setLoading(false);
    }
  }, [courseId]);

  const handleProjectSubmit = (projectId) => {
    const studentId = localStorage.getItem('vendorId'); // Ensure this is set
    if (!studentId) {
      setError("No student ID found. Please log in.");
      return;
    }
    navigate(`/dashboard/project-submit/${projectId}`, { state: { studentId } });
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!projects.length) return <p className="text-center text-gray-500">No projects found for this course.</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects for Course</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-blue-600">{project.title}</h3>
            <p className="text-gray-600 mt-2">{project.description.substring(0, 100)}...</p>
            <p className="text-sm text-gray-500 mt-1">Created: {new Date(project.created_at).toLocaleDateString()}</p>
            {project.pdf && (
              <a href={project.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 inline-block">
                View PDF
              </a>
            )}
            <button
              onClick={() => handleProjectSubmit(project.id)}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
            >
              Submit Project
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;