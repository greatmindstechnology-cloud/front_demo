import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./createInternship.css";

const CreateInternship = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setApiError(null);
    setFieldErrors({});
    setIsLoading(true);

    const vendorId = localStorage.getItem("vendorId");
    if (!vendorId) {
      setApiError("Vendor ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    // Validate dates (current date is June 11, 2025)
    const today = new Date("2025-06-11");
    const startDate = new Date(data.startDate);
    const applicationDeadline = new Date(data.applicationDeadline);

    if (startDate < today) {
      setError("startDate", {
        type: "manual",
        message: "Start date cannot be in the past.",
      });
      setIsLoading(false);
      return;
    }

    if (applicationDeadline < today) {
      setError("applicationDeadline", {
        type: "manual",
        message: "Application deadline cannot be in the past.",
      });
      setIsLoading(false);
      return;
    }

    if (applicationDeadline >= startDate) {
      setError("applicationDeadline", {
        type: "manual",
        message: "Application deadline must be before the start date.",
      });
      setIsLoading(false);
      return;
    }

    const skillsArray = data.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    if (skillsArray.length === 0) {
      setError("skills", {
        type: "manual",
        message: "At least one skill is required.",
      });
      setIsLoading(false);
      return;
    }

    const internshipData = {
      title: data.title,
      description: data.description,
      company_name: data.companyName, // Note: This field isn't in the database, but included in payload (backend will ignore it)
      location: data.location,
      mode: data.location.toLowerCase().includes("remote")
        ? "Online"
        : "In-Person",
      duration: data.duration,
      start_date: data.startDate,
      stipend: data.stipend,
      skills_required: skillsArray,
      eligibility_criteria: data.eligibility,
      application_deadline: data.applicationDeadline,
      number_of_openings: parseInt(data.openings, 10),
      contact_info: data.contact,
      category: data.category,
      application_process: data.applicationProcess,
    };

    try {
      const response = await axios.post(
        `http://localhost:8000/vendor_gmt/vendor-internship/create/?vendor_id=${vendorId}`,
        internshipData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert(
          `Internship created successfully! Internship ID: ${response.data.internship_id}`
        );
        navigate("/dashboard/vendor/");
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error creating internship:", error);
      if (error.response) {
        const errorData = error.response.data;
        if (error.response.status === 400 || error.response.status === 404) {
          setApiError(
            errorData.error ||
              "Failed to create internship. Please check your input."
          );
        } else if (typeof errorData === "object" && !errorData.message) {
          const newFieldErrors = {};
          Object.keys(errorData).forEach((key) => {
            const field =
              key === "contact_info"
                ? "contact"
                : key === "skills_required"
                  ? "skills"
                  : key === "eligibility_criteria"
                    ? "eligibility"
                    : key === "company_name"
                      ? "companyName"
                      : key === "start_date"
                        ? "startDate"
                        : key === "application_deadline"
                          ? "applicationDeadline"
                          : key === "number_of_openings"
                            ? "openings"
                            : key;
            newFieldErrors[field] = errorData[key][0] || "Invalid value";
            setError(field, { type: "manual", message: newFieldErrors[field] });
          });
          setFieldErrors(newFieldErrors);
        } else {
          setApiError(
            errorData.message ||
              errorData.error ||
              "Failed to create internship. Please try again."
          );
        }
      } else if (error.request) {
        setApiError(
          "No response from server. Please check your network connection."
        );
      } else {
        setApiError(
          error.message || "An error occurred while creating the internship."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-internship-container">
      <h2>Create Internship</h2>
      {apiError && <p className="error api-error">{apiError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="internship-form">
        <div className="form-group">
          <label>Internship Title</label>
          <input
            type="text"
            {...register("title", { required: "Internship title is required" })}
            placeholder="e.g., Software Development Intern"
          />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            placeholder="Describe the internship responsibilities and expectations"
          />
          {errors.description && (
            <p className="error">{errors.description.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            {...register("companyName", {
              required: "Company name is required",
            })}
            defaultValue="Business Name"
            readOnly
          />
          {errors.companyName && (
            <p className="error">{errors.companyName.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            placeholder="e.g., Chennai, India or Remote"
          />
          {errors.location && (
            <p className="error">{errors.location.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Duration</label>
          <input
            type="text"
            {...register("duration", { required: "Duration is required" })}
            placeholder="e.g., 3 months"
          />
          {errors.duration && (
            <p className="error">{errors.duration.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            {...register("startDate", { required: "Start date is required" })}
          />
          {errors.startDate && (
            <p className="error">{errors.startDate.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Stipend</label>
          <input
            type="text"
            {...register("stipend", { required: "Stipend is required" })}
            placeholder="e.g., ₹10,000/month or Unpaid"
          />
          {errors.stipend && <p className="error">{errors.stipend.message}</p>}
        </div>

        <div className="form-group">
          <label>Skills Required</label>
          <input
            type="text"
            {...register("skills", { required: "Skills are required" })}
            placeholder="e.g., Python, React, Communication Skills"
          />
          {errors.skills && <p className="error">{errors.skills.message}</p>}
        </div>

        <div className="form-group">
          <label>Eligibility Criteria</label>
          <textarea
            {...register("eligibility", {
              required: "Eligibility criteria are required",
            })}
            placeholder="e.g., Current college students, 3rd year or above"
          />
          {errors.eligibility && (
            <p className="error">{errors.eligibility.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Application Deadline</label>
          <input
            type="date"
            {...register("applicationDeadline", {
              required: "Application deadline is required",
            })}
          />
          {errors.applicationDeadline && (
            <p className="error">{errors.applicationDeadline.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Number of Openings</label>
          <input
            type="number"
            {...register("openings", {
              required: "Number of openings is required",
              min: 1,
            })}
            placeholder="e.g., 2"
          />
          {errors.openings && (
            <p className="error">{errors.openings.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Contact Information</label>
          <input
            type="text"
            {...register("contact", {
              required: "Contact information is required",
            })}
            placeholder="e.g., email@example.com or +91-1234567890"
          />
          {errors.contact && <p className="error">{errors.contact.message}</p>}
        </div>

        <div className="form-group">
          <label>Category/Department</label>
          <input
            type="text"
            {...register("category", { required: "Category is required" })}
            placeholder="e.g., Engineering, Marketing"
          />
          {errors.category && (
            <p className="error">{errors.category.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Application Process</label>
          <textarea
            {...register("applicationProcess", {
              required: "Application process is required",
            })}
            placeholder="e.g., Submit resume and cover letter via email"
          />
          {errors.applicationProcess && (
            <p className="error">{errors.applicationProcess.message}</p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Internship"}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard/vendor/")}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInternship;
