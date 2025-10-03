// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   ListSubheader,
//   Divider,
//   Box,
//   Typography,
//   Collapse,
// } from "@mui/material";
// import { useNavigate, useLocation, Outlet } from "react-router-dom";
// import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
// import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";
// import TaskIcon from "@mui/icons-material/Task";
// import { BiSolidInstitution } from "react-icons/bi";
// import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
// import FreeCancellationIcon from "@mui/icons-material/FreeCancellation";
// import SpeedIcon from "@mui/icons-material/Speed";
// import { CgDarkMode } from "react-icons/cg";
// import CastForEducationIcon from "@mui/icons-material/CastForEducation";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import DescriptionIcon from "@mui/icons-material/Description";
// import LayersIcon from "@mui/icons-material/Layers";
// import LogoutIcon from "@mui/icons-material/Logout";
// import "./Sidebar2.css";
// import IconButton from "@mui/material/IconButton";
// import Badge from "@mui/material/Badge";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import Avatar from "@mui/material/Avatar";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import MenuIcon from "@mui/icons-material/Menu";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import { MdOutlineDarkMode } from "react-icons/md";
// import LOGO_BLACK from "../assets/LOGO[BLACK].png";
// import LOGO_WHITE from "../assets/Logo_WHITE.png";
// import GradeIcon from "@mui/icons-material/Grade"; // For viewing grades
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import { Quiz as QuizIcon } from "@mui/icons-material";
// import BookingIcon from "@mui/icons-material/BookOnline";
// import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import Bloodtype from "@mui/icons-material/Bloodtype";
// import ChecklistIcon from "@mui/icons-material/Checklist";
// import Diversity3Icon from "@mui/icons-material/Diversity3";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import PsychologyIcon from "@mui/icons-material/Psychology";
// import TopicIcon from "@mui/icons-material/Topic";
// import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
// import VideoCallIcon from "@mui/icons-material/VideoCall";
// import SupportAgentIcon from "@mui/icons-material/SupportAgent";


// export default function CustomSideBar({ window }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [profileAnchorEl, setProfileAnchorEl] = useState(null);
//   const [openEvents, setOpenEvents] = useState(false); // State for Events dropdown

//   const handleProfileClick = (event) => {
//     setProfileAnchorEl(event.currentTarget);
//   };

//   const handleProfileClose = () => {
//     setProfileAnchorEl(null);
//   };

//   const handleEventsToggle = () => {
//     setOpenEvents((prev) => !prev); // Toggle Events dropdown
//   };

//   const role = localStorage.getItem("role")?.toLowerCase() || "";
//   console.log("Current role:", role);

//   const handleLogout = () => {
//     console.log("Logout triggered, clearing storage and navigating to /Login");
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate("/login", { replace: true });
//   };

//   useEffect(() => {
//     document.title = "Great Minds Technology";
//   }, []);

//   const allNavItems = [
//     {
//       kind: "header",
//       title:
//         role === "vendor"
//           ? "Vendor Dashboard"
//           : role === "student"
//             ? "Student Dashboard"
//             : role === "trainer"
//               ? "Trainer Dashboard"
//               : role === "admin"
//                 ? "Admin Dashboard"
//                 : "Dashboard",
//       allowedRoles: ["admin", "trainer", "student", "vendor"],
//     },
//     // Student Dashboard
//     {
//       segment: "", // Maps to /dashboard (index route)
//       title: "Dashboard",
//       icon: <LibraryBooksIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "certification",
//       title: "Certification",
//       icon: <FreeCancellationIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "attend-quiz",
//       title: "Attend Quiz",
//       icon: <QuizIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "submit-assignment",
//       title: "Submit Assignment",
//       icon: <DescriptionIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "grades",
//       title: "View Grades",
//       icon: <GradeIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "workshop-internship-listings",
//       title: "Workshop/Internship Listings",
//       icon: <BusinessCenterIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "tasks-projects",
//       title: "Tasks & Projects",
//       icon: <TaskIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "Studentinterview",
//       title: "Student interview",
//       icon: <TaskIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "Careerresource",
//       title: "Careerresource",
//       icon: <TaskIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "course",
//       title: "Courses",
//       icon: <SettingsInputAntennaIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "counceling-request",
//       title: "Counseling Request",
//       icon: <PsychologyIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "StudentCounselingRequests",
//       title: "My Counseling Requests",
//       icon: <SupportAgentIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "AvailableCounselors",
//       title: "Available Counselors",
//       icon: <PeopleAltIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "CounselorConductMeet",
//       title: "Counselor Meet",
//       icon: <VideoCallIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "ProjectSubmissionForm",
//       title: "ProjectSubmissionForm",
//       icon: <VideoCallIcon />,
//       allowedRoles: ["student"],
//     },
//     {
//       segment: "projectlist",
//       title: "Project List",
//       icon: <VideoCallIcon />,
//       allowedRoles: ["student"],
//     },

//     // Admin Dashboard
//     {
//       segment: "admin",
//       title: "Dashboard",
//       icon: <LibraryBooksIcon />,
//       allowedRoles: ["admin"],
//     },
//     {
//       segment: "admin/students",
//       title: "Student",
//       icon: <SettingsInputAntennaIcon />,
//       allowedRoles: ["admin"],
//     },
//     {
//       segment: "admin/trainer",
//       title: "Trainer Approval",
//       icon: <TaskIcon />,
//       allowedRoles: ["admin"],
//     },
//     {
//       segment: "admin/vendor",
//       title: "Vendor Approval",
//       icon: <InterpreterModeIcon />,
//       allowedRoles: ["admin"],
//     },
//     {
//       segment: "admin/courselist",
//       title: "Courses",
//       icon: <SettingsInputAntennaIcon />,
//       allowedRoles: ["admin"],
//     },
//     {
//       segment: "admin/addinstitute",
//       title: "Add/View/Edit Institutions",
//       icon: <BiSolidInstitution size={24} />,
//       allowedRoles: ["admin"],
//     },
//     {
//       segment: "admin/Approvedinternship",
//       title: "Approved Internship",
//       icon: <InterpreterModeIcon />,
//       allowedRoles: ["admin"],
//     },
//     {
//       segment: "admin/coursesapproval",
//       title: "Courses Approval",
//       icon: <InterpreterModeIcon />,
//       allowedRoles: ["admin"],
//     },
//     {
//       segment: "admin/Csreporting",
//       title: "Csreporting",
//       icon: <SettingsInputAntennaIcon />,
//       allowedRoles: ["admin"],
//     },
//     {
//       segment: "admin/Counselorapproval",
//       title: "Counselorapproval",
//       icon: <SettingsInputAntennaIcon />,
//       allowedRoles: ["admin"],
//     },
//     // Trainer Dashboard
//     {
//       segment: "trainer",
//       title: "Dashboard",
//       icon: <LibraryBooksIcon />,
//       allowedRoles: ["trainer"],
//     },
//     {
//       segment: "trainer/assignment",
//       title: "Create Assignment",
//       icon: <DescriptionIcon />,
//       allowedRoles: ["trainer"],
//     },
//     {
//       segment: "trainer/topic-create",
//       title: "Create Topic",
//       icon: <DescriptionIcon />,
//       allowedRoles: ["trainer"],
//     },
//     {
//       segment: "coursecreation",
//       title: "Add Course",
//       icon: <LibraryBooksIcon />,
//       allowedRoles: ["trainer"],
//     },
//     {
//       segment: "trainer/grade",
//       title: "Grade Assignments",
//       icon: <AssignmentIcon />,
//       allowedRoles: ["trainer"],
//     },
//     {
//       segment: "trainer/create-project",
//       title: "Create Project/Task",
//       icon: <TaskIcon />,
//       allowedRoles: ["trainer"],
//     },
//     {
//       segment: "trainer/Mockinterview",
//       title: "Mockinterview",
//       icon: <TaskIcon />,
//       allowedRoles: ["trainer"],
//     },
//     {
//       segment: "trainer/Socialdrives",
//       title: "Socialdrives",
//       icon: <TaskIcon />,
//       allowedRoles: ["trainer"],
//     },
//     {
//       segment: "Internships",
//       title: "Internships",
//       icon: <TaskIcon />,
//       allowedRoles: ["trainer"],
//     },
//     {
//       segment: "trainer/Csrdetails",
//       title: "Csrdetails",
//       icon: <TaskIcon />,
//       allowedRoles: ["trainer"],
//     },
//     {
//       segment: "trainer/Counselor",
//       title: "Counselor",
//       icon: <TaskIcon />,
//       allowedRoles: ["trainer"],
//     },
//     {
//       segment: "Events",
//       title: "Events",
//       icon: <TaskIcon />,
//       allowedRoles: ["student"],
//       // children: [
//       //  {
//       //     segment: "workshop",
//       //     title: "Workshop",
//       //     icon: <TaskIcon />,
//       //     allowedRoles: ["student"],
//       //   },
//       //   {
//       //     segment: "seminar",
//       //     title: "Seminar",
//       //     icon: <TaskIcon />,
//       //     allowedRoles: ["student"],
//       //   },
//       // ],
//     },
//     {
//       segment: "trainer/manage-uploads",
//       title: "Manage Uploads",
//       icon: <DescriptionIcon />,
//       allowedRoles: ["trainer"],
//     },
//     // Vendor Dashboard
//     {
//       segment: "vendor",
//       title: "Vendor Profile",
//       icon: <InterpreterModeIcon />,
//       allowedRoles: ["vendor"],
//     },
//     {
//       segment: "vendor/socialservice",
//       title: "Socialservice",
//       icon: <InterpreterModeIcon />,
//       allowedRoles: ["vendor"],
//     },
//     {
//       segment: "vendor/internships-and-events",
//       title: "Internships And Events",
//       icon: <InterpreterModeIcon />,
//       allowedRoles: ["vendor"],
//     },
//     {
//       segment: "bloodrequestpage",
//       title: "Blood Need [Emergency]",
//       icon: <Bloodtype />,
//       allowedRoles: ["admin", "trainer", "student", "vendor"],
//     },
//     {
//       kind: "divider",
//       allowedRoles: ["admin", "trainer", "student", "vendor"],
//     },
//     {
//       key: "logout",
//       title: "Logout",
//       icon: <LogoutIcon />,
//       onClick: handleLogout,
//       allowedRoles: ["admin", "trainer", "student", "vendor"],
//     },
//   ];

//   // Filter nav items by role
//   const navItems = useMemo(() => {
//     const filterByRole = (items) =>
//       items
//         .filter(
//           (item) => !item.allowedRoles || item.allowedRoles.includes(role)
//         )
//         .map((item) =>
//           item.children
//             ? { ...item, children: filterByRole(item.children) }
//             : item
//         );
//     return filterByRole(allNavItems);
//   }, [role]);

//   const container = window ? window().document.body : undefined;

//   const [themeMode, setThemeMode] = useState("light");

//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode: themeMode,
//         },
//       }),
//     [themeMode]
//   );

//   return (
//     <ThemeProvider theme={theme}>
//       <Box
//         sx={{
//           display: "flex",
//           height: "100vh",
//           backgroundColor: themeMode === "light" ? "white" : "black",
//         }}
//       >
//         <Drawer
//           container={container}
//           variant="permanent"
//           sx={{
//             width: 300,
//             flexShrink: 0,
//             "& .MuiDrawer-paper": { width: 300, boxSizing: "border-box" },
//           }}
//         >
//           <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//             <img
//               src={themeMode === "light" ? LOGO_BLACK : LOGO_WHITE}
//               alt="Great Minds Technology Logo"
//               style={{ maxWidth: "50%", height: "auto" }}
//             />
//           </Box>
//           <Box sx={{ display: "flex", justifyContent: "center" }}>
//             <IconButton
//               onClick={() => {
//                 const newTheme = themeMode === "light" ? "dark" : "light";
//                 setThemeMode(newTheme);
//                 console.log("Switched theme to:", newTheme);
//               }}
//             >
//               <Badge color="secondary">
//                 <MdOutlineDarkMode />
//               </Badge>
//             </IconButton>
//           </Box>
//           <List>
//             {navItems.map((item, index) => {
//               if (item.kind === "header") {
//                 return <ListSubheader key={index}>{item.title}</ListSubheader>;
//               }
//               if (item.kind === "divider") {
//                 return <Divider key={index} />;
//               }
//               // if (item.children && item.segment === "StudentDashboard/Events") {
//               //   return (
//               //     <React.Fragment key={item.segment}>
//               //       <ListItem
//               //         button
//               //         onClick={handleEventsToggle}
//               //       >
//               //         <ListItemIcon>{item.icon}</ListItemIcon>
//               //         <ListItemText primary={item.title} />
//               //         {openEvents ? <ExpandLess /> : <ExpandMore />}
//               //       </ListItem>
//               //       <Collapse in={openEvents} timeout="auto" unmountOnExit>
//               //         <List component="div" disablePadding>
//               //           {item.children.map((child) => (
//               //             <ListItem
//               //               button
//               //               key={child.segment}
//               //               sx={{ pl: 4 }}
//               //               onClick={() => {
//               //                 console.log(
//               //                   "Navigating to:",
//               //                   `/dashboard/${item.segment}/${child.segment}`
//               //                 );
//               //                 navigate(`/dashboard/${item.segment}/${child.segment}`);
//               //               }}
//               //             >
//               //               <ListItemIcon>{child.icon}</ListItemIcon>
//               //               <ListItemText primary={child.title} />
//               //             </ListItem>
//               //           ))}
//               //         </List>
//               //       </Collapse>
//               //     </React.Fragment>
//               //   );
//               // }
//               if (item.children) {
//                 return (
//                   <React.Fragment key={item.segment}>
//                     <ListItem
//                       button
//                       onClick={() => {
//                         console.log(
//                           "Navigating to:",
//                           `/dashboard/${item.segment}`
//                         );
//                         navigate(`/dashboard/${item.segment}`);
//                       }}
//                     >
//                       <ListItemIcon>{item.icon}</ListItemIcon>
//                       <ListItemText primary={item.title} />
//                     </ListItem>
//                     <List component="div" disablePadding>
//                       {item.children.map((child) => (
//                         <ListItem
//                           button
//                           key={child.segment}
//                           sx={{ pl: 4 }}
//                           onClick={() => {
//                             console.log(
//                               "Navigating to:",
//                               `/dashboard/${item.segment}/${child.segment}`
//                             );
//                             navigate(
//                               `/dashboard/${item.segment}/${child.segment}`
//                             );
//                           }}
//                         >
//                           <ListItemIcon>{child.icon}</ListItemIcon>
//                           <ListItemText primary={child.title} />
//                         </ListItem>
//                       ))}
//                     </List>
//                   </React.Fragment>
//                 );
//               }
//               return (
//                 <ListItem
//                   button
//                   key={item.segment || item.key}
//                   onClick={
//                     item.onClick ||
//                     (() => {
//                       console.log(
//                         "Navigating to:",
//                         `/dashboard/${item.segment}`
//                       );
//                       navigate(`/dashboard/${item.segment}`);
//                     })
//                   }
//                 >
//                   <ListItemIcon>{item.icon}</ListItemIcon>
//                   <ListItemText primary={item.title} />
//                 </ListItem>
//               );
//             })}
//           </List>
//         </Drawer>
//         <Box component="main" sx={{ flexGrow: 1 }}>
//           <Outlet />
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }
// src/Pages/sidebar2.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
  Box,
  Typography,
  Collapse,
} from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import TaskIcon from "@mui/icons-material/Task";
import { BiSolidInstitution } from "react-icons/bi";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import FreeCancellationIcon from "@mui/icons-material/FreeCancellation";
import SpeedIcon from "@mui/icons-material/Speed";
import { CgDarkMode } from "react-icons/cg";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Sidebar2.css";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MdOutlineDarkMode } from "react-icons/md";
import LOGO_BLACK from "../assets/LOGO[BLACK].png";
import LOGO_WHITE from "../assets/Logo_WHITE.png";
import GradeIcon from "@mui/icons-material/Grade"; // For viewing grades
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Quiz as QuizIcon } from "@mui/icons-material";
import BookingIcon from "@mui/icons-material/BookOnline";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Bloodtype from "@mui/icons-material/Bloodtype";
import ChecklistIcon from "@mui/icons-material/Checklist";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TopicIcon from "@mui/icons-material/Topic";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export default function CustomSideBar({ window }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [openEvents, setOpenEvents] = useState(false); // State for Events dropdown

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleEventsToggle = () => {
    setOpenEvents((prev) => !prev); // Toggle Events dropdown
  };

  const role = localStorage.getItem("role")?.toLowerCase() || "";
  console.log("Current role:", role);

  const handleLogout = () => {
    console.log("Logout triggered, clearing storage and navigating to /Login");
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    document.title = "Great Minds Technology";
  }, []);

  const allNavItems = [
    {
      kind: "header",
      title:
        role === "vendor"
          ? "Vendor Dashboard"
          : role === "student"
            ? "Student Dashboard"
            : role === "trainer"
              ? "Trainer Dashboard"
              : role === "admin"
                ? "Admin Dashboard"
                : "Dashboard",
      allowedRoles: ["admin", "trainer", "student", "vendor"],
    },
    // Student Dashboard
    {
      segment: "", // Maps to /dashboard (index route)
      title: "Dashboard",
      icon: <LibraryBooksIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "certification",
      title: "Certification",
      icon: <FreeCancellationIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "attend-quiz",
      title: "Attend Quiz",
      icon: <QuizIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "submit-assignment",
      title: "Submit Assignment",
      icon: <DescriptionIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "grades",
      title: "View Grades",
      icon: <GradeIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "workshop-internship-listings",
      title: "Workshop/Internship Listings",
      icon: <BusinessCenterIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "tasks-projects",
      title: "Tasks & Projects",
      icon: <TaskIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "Studentinterview",
      title: "Student interview",
      icon: <TaskIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "Careerresource",
      title: "Careerresource",
      icon: <TaskIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "course",
      title: "Courses",
      icon: <SettingsInputAntennaIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "counceling-request",
      title: "Counseling Request",
      icon: <PsychologyIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "StudentCounselingRequests",
      title: "My Counseling Requests",
      icon: <SupportAgentIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "AvailableCounselors",
      title: "Available Counselors",
      icon: <PeopleAltIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "CounselorConductMeet",
      title: "Counselor Meet",
      icon: <VideoCallIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "ProjectList",
      title: "Project List",
      icon: <ChecklistIcon />, // Added icon for Project List
      allowedRoles: ["student"],
    },
    // Admin Dashboard
    {
      segment: "admin",
      title: "Dashboard",
      icon: <LibraryBooksIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/students",
      title: "Student",
      icon: <SettingsInputAntennaIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/trainer",
      title: "Trainer Approval",
      icon: <TaskIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/vendor",
      title: "Vendor Approval",
      icon: <InterpreterModeIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/courselist",
      title: "Courses",
      icon: <SettingsInputAntennaIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/addinstitute",
      title: "Add/View/Edit Institutions",
      icon: <BiSolidInstitution size={24} />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/Approvedinternship",
      title: "Approved Internship",
      icon: <InterpreterModeIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/coursesapproval",
      title: "Courses Approval",
      icon: <InterpreterModeIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/Csreporting",
      title: "Csreporting",
      icon: <SettingsInputAntennaIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/Counselorapproval",
      title: "Counselorapproval",
      icon: <SettingsInputAntennaIcon />,
      allowedRoles: ["admin"],
    },
    // Trainer Dashboard
    {
      segment: "trainer",
      title: "Dashboard",
      icon: <LibraryBooksIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "trainer/assignment",
      title: "Create Assignment",
      icon: <DescriptionIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "trainer/topic-create",
      title: "Create Topic",
      icon: <DescriptionIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "coursecreation",
      title: "Add Course",
      icon: <LibraryBooksIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "trainer/grade",
      title: "Grade Assignments",
      icon: <AssignmentIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "trainer/Mockinterview",
      title: "Mockinterview",
      icon: <TaskIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "trainer/Socialdrives",
      title: "Socialdrives",
      icon: <TaskIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "Internships",
      title: "Internships",
      icon: <TaskIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "trainer/Csrdetails",
      title: "Csrdetails",
      icon: <TaskIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "trainer/Counselor",
      title: "Counselor",
      icon: <TaskIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "Events",
      title: "Events",
      icon: <TaskIcon />,
      allowedRoles: ["student"],
    },
    // Vendor Dashboard
    {
      segment: "vendor",
      title: "Vendor Profile",
      icon: <InterpreterModeIcon />,
      allowedRoles: ["vendor"],
    },
    {
      segment: "vendor/socialservice",
      title: "Socialservice",
      icon: <InterpreterModeIcon />,
      allowedRoles: ["vendor"],
    },
    {
      segment: "vendor/internships-and-events",
      title: "Internships And Events",
      icon: <InterpreterModeIcon />,
      allowedRoles: ["vendor"],
    },
    {
      segment: "bloodrequestpage",
      title: "Blood Need [Emergency]",
      icon: <Bloodtype />,
      allowedRoles: ["admin", "trainer", "student", "vendor"],
    },
    {
      kind: "divider",
      allowedRoles: ["admin", "trainer", "student", "vendor"],
    },
    {
      key: "logout",
      title: "Logout",
      icon: <LogoutIcon />,
      onClick: handleLogout,
      allowedRoles: ["admin", "trainer", "student", "vendor"],
    },
  ];

  // Filter nav items by role
  const navItems = useMemo(() => {
    const filterByRole = (items) =>
      items
        .filter(
          (item) => !item.allowedRoles || item.allowedRoles.includes(role)
        )
        .map((item) =>
          item.children
            ? { ...item, children: filterByRole(item.children) }
            : item
        );
    return filterByRole(allNavItems);
  }, [role]);

  const container = window ? window().document.body : undefined;

  const [themeMode, setThemeMode] = useState("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          backgroundColor: themeMode === "light" ? "white" : "black",
        }}
      >
        <Drawer
          container={container}
          variant="permanent"
          sx={{
            width: 300,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: 300, boxSizing: "border-box" },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <img
              src={themeMode === "light" ? LOGO_BLACK : LOGO_WHITE}
              alt="Great Minds Technology Logo"
              style={{ maxWidth: "50%", height: "auto" }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              onClick={() => {
                const newTheme = themeMode === "light" ? "dark" : "light";
                setThemeMode(newTheme);
                console.log("Switched theme to:", newTheme);
              }}
            >
              <Badge color="secondary">
                <MdOutlineDarkMode />
              </Badge>
            </IconButton>
          </Box>
          <List>
            {navItems.map((item, index) => {
              if (item.kind === "header") {
                return <ListSubheader key={index}>{item.title}</ListSubheader>;
              }
              if (item.kind === "divider") {
                return <Divider key={index} />;
              }
              if (item.children && item.segment === "Events") {
                return (
                  <React.Fragment key={item.segment}>
                    <ListItem
                      button
                      onClick={handleEventsToggle}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.title} />
                      {openEvents ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openEvents} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.children.map((child) => (
                          <ListItem
                            button
                            key={child.segment}
                            sx={{ pl: 4 }}
                            onClick={() => {
                              console.log(
                                "Navigating to:",
                                `/dashboard/${item.segment}/${child.segment}`
                              );
                              navigate(`/dashboard/${item.segment}/${child.segment}`);
                            }}
                          >
                            <ListItemIcon>{child.icon}</ListItemIcon>
                            <ListItemText primary={child.title} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
              }
              if (item.children) {
                return (
                  <React.Fragment key={item.segment}>
                    <ListItem
                      button
                      onClick={() => {
                        console.log(
                          "Navigating to:",
                          `/dashboard/${item.segment}`
                        );
                        navigate(`/dashboard/${item.segment}`);
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.title} />
                    </ListItem>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItem
                          button
                          key={child.segment}
                          sx={{ pl: 4 }}
                          onClick={() => {
                            console.log(
                              "Navigating to:",
                              `/dashboard/${item.segment}/${child.segment}`
                            );
                            navigate(
                              `/dashboard/${item.segment}/${child.segment}`
                            );
                          }}
                        >
                          <ListItemIcon>{child.icon}</ListItemIcon>
                          <ListItemText primary={child.title} />
                        </ListItem>
                      ))}
                    </List>
                  </React.Fragment>
                );
              }
              return (
                <ListItem
                  button
                  key={item.segment || item.key}
                  onClick={
                    item.onClick ||
                    (() => {
                      console.log(
                        "Navigating to:",
                        `/dashboard/${item.segment}`
                      );
                      navigate(`/dashboard/${item.segment}`);
                    })
                  }
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItem>
              );
            })}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}