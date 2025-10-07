// src/App.jsx
import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { GoogleOAuthProvider } from "@react-oauth/google";
import StudentEditForm from "./Pages/studentEditForm";
import UserProfileStart from "./Pages/Userprofilestart";
import TrainerEditProfile from "./Pages/Trainer/trainerEditProfile";
import TrainerProfile from "./Pages/Trainer/TrainerProfile.jsx";
import GMTSideBar from "./Pages/sidebar2";
import VendorProfile from "./Pages/Vendor/vendorProfile";
import VendorEditProfile from "./Pages/Vendor/verndorEditProfile";
import SASidebar from "./Pages/SuperAdmin/SASidebar";
import AdminDashboard from "./Pages/Admin/adminDashboard";
import AddViewInstitution from "./Pages/Admin/AddViewInstitution";
import StudentList from "./Pages/Admin/Student/studentList";
import TrainerApproval from "./Pages/Admin/Trainer/approvalTrainer";
import TrainerDetailsForm from "./Pages/Trainer/trainerSubmitForm";
import VendorDetailsForm from "./Pages/Vendor/vendorSubmitForm";
import VendorApproval from "./Pages/Admin/Vendor/approvalVendor";
import CreateCourse from "./Pages/Trainer/trainerCourseCreate";
import CourseList from "./Pages/Courses/CourseList";
import CourseDetail from "./Pages/Courses/CourseDetail";
import CourseVideoPage from "./Pages/CourseVideo/CourseVideoPage";
import BatchSchedulingPage from "./Pages/BatchScheduling/BatchSchedulingPage";
import LandingPageConst from "./Pages/Landing Page/LandingPageConst";
import CourseEnrollments from "./Pages/Enrollments/CourseEnrollments";
import EnhancedTable from "./Pages/Enrollments/Enrollment_Students";
import Certificate from "./components/PDFGenerate/CertificateForm";
import ResetPassword from "./Pages/ResetPassword";
import StudentDashboard from "./Pages/StudentDashboard/StudentDashboard";
import TrainerDashboard from "./Pages/TrainerDashboard/TrainerDashboard";
import VendorDashboard from "./Pages/Vendor/vendorDashboard";
import ProtectedRoute from "./Pages/ProtectedRoute";
import SuperAdminDashBar from "./Pages/SuperAdmin/SuperAdminDashBoard";
import AdminList from "./Pages/SuperAdmin/AdminList";
import CreateInternship from "./Pages/Vendor/CreateInternship";
import CreateEvent from "./Pages/Vendor/CreateEvent";
import InternshipsAndEvents from "./Pages/Vendor/InternshipsAndEvents";
import CreateSelection from "./Pages/Vendor/CreateSelection";
import CertificationList from "./Pages/StudentDashboard/CertificationList";
import CourseFeedbackForm from "./components/FeedbackForms/PostFeedback";
import ComponentTrailPage from "./Pages/Admin/ComponentTrailPage";
import SentimentAnalysisAdmin from "./Pages/Admin/Sentimental";
import CreateTopic from "./Pages/Trainer/CreateTopic";
import CreateQuizQuestion from "./Pages/Trainer/CreateQuizQuestion";
import AttendQuiz from "./Pages/StudentDashboard/AttendQuiz";
import TrainerAssignment from "./Pages/Trainer/TrainerAssignment";
import StudentAssignmentSubmissionPage from "./Pages/StudentDashboard/StudentAssignmentSubmissionPage";
import TrainerGradeAssignment from "./Pages/Trainer/TrainerGradeAssignment";
import StudentViewGrades from "./Pages/StudentDashboard/StudentViewGrades";
import CreateProject from "./Pages/Trainer/CreateProjectTask";
import ViewManageUploads from "./Pages/Trainer/ViewManageUploads";
import ViewSubmissions from "./Pages/Trainer/ViewSubmissions";
import WorkshopInternshipListings from "./Pages/StudentDashboard/WorkshopInternshipListings";
import ViewTasksProjects from "./Pages/StudentDashboard/ViewTasksProjects";
import BookingInterface from "./Pages/StudentDashboard/BookingInterface";
import Internships from "./Pages/StudentDashboard/Internships";
import Events from "./Pages/StudentDashboard/Events";
import Workshop from "./Pages/StudentDashboard/Workshop";
import Seminar from "./Pages/StudentDashboard/Seminar";
import CoursesApproval from "./Pages/Admin/CoursesApproval";
import Approvedinternship from "./Pages/Admin/Approvedinternship";
import Mockinterview from "./Pages/Trainer/Mockinterview";
import Socialdrives from "./Pages/Trainer/Socialdrives";
import Studentinterview from "./Pages/StudentDashboard/Studentinterview";
import Careerresource from "./Pages/StudentDashboard/Careerresource";
import Socialservice from "./Pages/Vendor/Socialservice";
import Csreporting from "./Pages/Admin/Csreporting";
import Csrdetails from "./Pages/Trainer/Csrdetails";
import Counselor from "./Pages/Trainer/Counselor";
import Counselorapproval from "./Pages/Admin/Counselorapproval";
import BloodRequestsPage from "./Pages/BloodRequestPage";
import StudentCounselingRequestsForm from "./Pages/StudentDashboard/StudentCounselingRequestForm";
import StudentCounselingRequests from "./Pages/StudentDashboard/StudentCounselingRequests";
import AvailableCounselors from "./Pages/StudentDashboard/AvailableCounselors";
import CounselorConductMeet from "./Pages/StudentDashboard/CounselorConductMeet";
import AdminCounselorApplications from "./Pages/Admin/AdminCounselorApplications";
import ProjectSubmissionForm from "./Pages/StudentDashboard/ProjectSubmissionForm";
import ProjectList from "./Pages/StudentDashboard/ProjectList";
import CreateTask from "./Pages/Trainer/CreateTask";
import GetTasks from "./Pages/StudentDashboard/GetTasks";
import SubmitTask from "./Pages/StudentDashboard/SubmitTask";
import MyCourses from "./Pages/StudentDashboard/MyCourses";
import BookCard from "./Pages/Courses/BookCard";

// Placeholder components for missing routes
const Certification = () => <div>Certification Page (Student)</div>;
const Motivation = () => <div>Motivation Page (Student)</div>;
const Guidance = () => <div>Guidance Page (Student)</div>;
const Reports = () => <div>Reports Page (Admin)</div>;
const SalesReport = () => <div>Sales Report Page (Admin)</div>;
const TrafficReport = () => <div>Traffic Report Page (Admin)</div>;
const Integrations = () => <div>Integrations Page (Admin)</div>;

function App() {
  return (
    <GoogleOAuthProvider clientId="AIzaSyC94KMkTu_pIB-EJEUkUjMXc55zSW16Vys">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPageConst />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/trainer-details" element={<TrainerDetailsForm />} />
          <Route path="/vendor-details" element={<VendorDetailsForm />} />

          {/* Shared Routes (accessible to all roles) */}
          <Route path="/coursecounts" element={<CourseEnrollments />} />
          <Route path="/coursestudents" element={<EnhancedTable />} />
          <Route path="/coursefeedback" element={<CourseFeedbackForm courseId={1} />} />

          {/* Student Routes (outside dashboard) */}
          <Route path="/studentdashboard" element={<UserProfileStart />} />

          {/* Dashboard Routes with Sidebar */}
          <Route path="/dashboard/*" element={<GMTSideBar />}>
            <Route path="BloodRequestPage" element={<BloodRequestsPage />} />
            {/* Student Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route index element={<StudentDashboard />} />
              <Route path="editform" element={<StudentEditForm />} />
              <Route path="course/:id" element={<CourseDetail />} />
              <Route path="course" element={<CourseList />} />
              <Route path="course/:id" element={<CourseDetail />} />
              <Route path="course/:id/video" element={<CourseVideoPage />} />
              <Route path="book-card" element={<BookCard />} />
              <Route path="coursedetails" element={<CourseDetail />} />
              <Route path="certification" element={<CertificationList />} />
              <Route path="motivation" element={<Motivation />} />
              <Route path="guidance" element={<Guidance />} />
              <Route path="attend-quiz" element={<AttendQuiz />} />
              <Route path="submit-assignment" element={<StudentAssignmentSubmissionPage />} />
              <Route path="grades" element={<StudentViewGrades />} />
              <Route path="workshop-internship-listings" element={<WorkshopInternshipListings />} />
              <Route path="tasks-projects" element={<ViewTasksProjects />} />
              <Route path="ProjectSubmissionForm" element={<ProjectSubmissionForm />} />
              <Route path="ProjectList" element={<ProjectList />} />
              <Route path="project-submit/:projectId" element={<ProjectSubmissionForm />} /> {/* New route */}
              <Route path="GetTasks" element={<GetTasks />} />
              <Route path="SubmitTask" element={<SubmitTask />} />
              <Route path="submit-task/:taskId" element={<SubmitTask />} />
              <Route path="Internships" element={<Internships />} />
              <Route path="Studentinterview" element={<Studentinterview />} />
              <Route path="Careerresource" element={<Careerresource />} />
              <Route path="counceling-request" element={<StudentCounselingRequestsForm />} />
              <Route path="StudentCounselingRequests" element={<StudentCounselingRequests />} />
              <Route path="AvailableCounselors" element={<AvailableCounselors />} />
              <Route path="CounselorConductMeet" element={<CounselorConductMeet />} />
              <Route path="Events" element={<Events />}>
                <Route path="workshop" element={<Workshop />} />
                <Route path="seminar" element={<Seminar />} />
              </Route>
              <Route path="booking/:id" element={<BookingInterface />} />
              <Route path="MyCourses" element={<MyCourses />} />
            </Route>

            {/* Trainer Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
              <Route path="trainer">
                <Route index element={<TrainerDashboard />} />
                <Route path="trainerprofile" element={<TrainerProfile />} />
                <Route path="trainereditprofile" element={<TrainerEditProfile />} />
                <Route path="coursecreation" element={<CreateCourse />} />
                <Route path="courselist" element={<CourseList />} />
                <Route path="courses/:query" element={<CourseList />} />
                <Route path="course/:id" element={<CourseDetail />} />
                <Route path="course/:id/video" element={<CourseVideoPage />} />
                <Route path="topic-create" element={<CreateTopic />} />
                <Route path="quiz-question-create/:topicId" element={<CreateQuizQuestion />} />
                <Route path="assignment" element={<TrainerAssignment />} />
                <Route path="grade" element={<TrainerGradeAssignment />} />
                <Route path="create-project" element={<CreateProject />} />
                <Route path="create-task" element={<CreateTask />} />
                <Route path="manage-uploads" element={<ViewManageUploads />} />
                <Route path="view-submissions/:id" element={<ViewSubmissions />} />
                <Route path="Mockinterview" element={<Mockinterview />} />
                <Route path="Socialdrives" element={<Socialdrives />} />
                <Route path="Csrdetails" element={<Csrdetails />} />
                <Route path="Counselor" element={<Counselor />} />
              </Route>
            </Route>

            {/* Vendor Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
              <Route path="vendor">
                <Route index element={<VendorDashboard />} />
                <Route path="vendorprofile" element={<VendorProfile />} />
                <Route path="createInternship" element={<CreateInternship />} />
                <Route path="createevent" element={<CreateEvent />} />
                <Route path="VendorEditProfile" element={<VendorEditProfile />} />
                <Route path="internships-and-events" element={<InternshipsAndEvents />} />
                <Route path="socialservice" element={<Socialservice />} />
                <Route path="create" element={<CreateSelection />} />
              </Route>
            </Route>

            {/* Shared Dashboard Routes (accessible to multiple roles) */}
            <Route element={<ProtectedRoute allowedRoles={["trainer", "vendor"]} />}>
              <Route path="coursecreation" element={<CreateCourse />} />
              <Route path="batch-scheduling" element={<BatchSchedulingPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="admin" element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<StudentList />} />
              <Route path="addinstitute" element={<AddViewInstitution />} />
              <Route path="comptrail" element={<ComponentTrailPage />} />
              <Route path="trainer" element={<TrainerApproval />} />
              <Route path="vendor" element={<VendorApproval />} />
              <Route path="courselist" element={<CourseList />} />
              <Route path="courses/:query" element={<CourseList />} />
              <Route path="course/:id" element={<CourseDetail />} />
              <Route path="course/:id/video" element={<CourseVideoPage />} />
              <Route path="coursecounts" element={<CourseEnrollments />} />
              <Route path="coursestudents" element={<EnhancedTable />} />
              <Route path="certificate" element={<Certificate />} />
              <Route path="sanalysis" element={<SentimentAnalysisAdmin />} />
              <Route path="reports" element={<Reports />} />
              <Route path="reports/sales" element={<SalesReport />} />
              <Route path="reports/traffic" element={<TrafficReport />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="Approvedinternship" element={<Approvedinternship />} />
              <Route path="Csreporting" element={<Csreporting />} />
              <Route path="coursesapproval" element={<CoursesApproval />} />
              <Route path="Counselorapproval" element={<AdminCounselorApplications />} />
            </Route>
          </Route>

          {/* SuperAdmin Routes */}
          <Route path="/sdashboard/*" element={<SASidebar />}>
            <Route path="sadmin" element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
              <Route index element={<SuperAdminDashBar />} />
              <Route path="students" element={<StudentList />} />
              <Route path="trainer" element={<TrainerApproval />} />
              <Route path="vendor" element={<VendorApproval />} />
              <Route path="courselist" element={<CourseList />} />
              <Route path="coursestudents" element={<EnhancedTable />} />
              <Route path="admins" element={<AdminList />} />
            </Route>
          </Route>

          {/* Catch-all route for unknown paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
