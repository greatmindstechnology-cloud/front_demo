import React, { useEffect, useState, useMemo } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Collapse,
  IconButton,
  Switch,
  Avatar,
  Chip,
  Tooltip,
  Paper,
  useTheme,
  alpha,
  Fade
} from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  LibraryBooks as LibraryBooksIcon,
  SettingsInputAntenna as SettingsInputAntennaIcon,
  Task as TaskIcon,
  InterpreterMode as InterpreterModeIcon,
  FreeCancellation as FreeCancellationIcon,
  Speed as SpeedIcon,
  CastForEducation as CastForEducationIcon,
  BarChart as BarChartIcon,
  Description as DescriptionIcon,
  Layers as LayersIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Grade as GradeIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  BookOnline as BookingIcon,
  BusinessCenter as BusinessCenterIcon,
  ExpandLess,
  ExpandMore,
  Bloodtype,
  Checklist as ChecklistIcon,
  Diversity3 as Diversity3Icon,
  CloudUpload as CloudUploadIcon,
  Psychology as PsychologyIcon,
  Topic as TopicIcon,
  PeopleAlt as PeopleAltIcon,
  VideoCall as VideoCallIcon,
  SupportAgent as SupportAgentIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Store as VendorIcon,
  LightMode,
  DarkMode,
  ChevronRight,
  Home
} from "@mui/icons-material";
import { BiSolidInstitution } from "react-icons/bi";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LOGO_BLACK from "../assets/LOGO[BLACK].png";
import LOGO_WHITE from "../assets/Logo_WHITE.png";
import "./Sidebar2.css";

export default function CustomSideBar({ window }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [openEvents, setOpenEvents] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [themeMode, setThemeMode] = useState("light");

  const handleEventsToggle = () => {
    setOpenEvents((prev) => !prev);
  };

  const role = localStorage.getItem("role")?.toLowerCase() || "";
  const userName = localStorage.getItem("userEmail") || "User";
  
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

  const customTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: themeMode === 'light' ? '#1976d2' : '#90caf9',
          },
          background: {
            default: themeMode === 'light' ? '#f5f5f5' : '#121212',
            paper: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        components: {
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
                borderRight: `1px solid ${themeMode === 'light' ? '#e0e0e0' : '#333'}`,
              },
            },
          },
        },
      }),
    [themeMode]
  );

  const getRoleInfo = () => {
    switch (role) {
      case "admin":
        return { 
          title: "Admin Dashboard", 
          icon: <AdminIcon />, 
          color: '#d32f2f',
          description: "System Administrator" 
        };
      case "trainer":
        return { 
          title: "Trainer Dashboard", 
          icon: <SchoolIcon />, 
          color: '#1976d2',
          description: "Course Instructor" 
        };
      case "student":
        return { 
          title: "Student Portal", 
          icon: <PersonIcon />, 
          color: '#388e3c',
          description: "Learning Journey" 
        };
      case "vendor":
        return { 
          title: "Vendor Dashboard", 
          icon: <VendorIcon />, 
          color: '#f57c00',
          description: "Business Partner" 
        };
      default:
        return { 
          title: "Dashboard", 
          icon: <DashboardIcon />, 
          color: '#757575',
          description: "Portal" 
        };
    }
  };

  const allNavItems = [
    // Student Dashboard
    {
      segment: "",
      title: "Dashboard",
      icon: <Home />,
      allowedRoles: ["student"],
    },
    {
      segment: "MyCourses",
      title: "My Courses",
      icon: <CastForEducationIcon />,
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
      segment: "workshop-internship-listings",
      title: "Workshop & Internships",
      icon: <BusinessCenterIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "Studentinterview",
      title: "Interview Prep",
      icon: <TaskIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "Careerresource",
      title: "Career Resources",
      icon: <TaskIcon />,
      allowedRoles: ["student"],
    },
    {
      segment: "course",
      title: "Browse Courses",
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
      title: "My Counseling",
      icon: <SupportAgentIcon />,
      allowedRoles: ["student"],
    },
    // {
    //   segment: "AvailableCounselors",
    //   title: "Available Counselors",
    //   icon: <PeopleAltIcon />,
    //   allowedRoles: ["student"],
    // },

    // Admin Dashboard
    {
      segment: "admin",
      title: "Admin Dashboard",
      icon: <DashboardIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/students",
      title: "Students",
      icon: <PersonIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/trainer",
      title: "Trainer Approval",
      icon: <SchoolIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/vendor",
      title: "Vendor Approval",
      icon: <VendorIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/courselist",
      title: "Course Management",
      icon: <LibraryBooksIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/addinstitute",
      title: "Institutions",
      icon: <BiSolidInstitution size={24} />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/Approvedinternship",
      title: "Approved Internships",
      icon: <BusinessCenterIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/coursesapproval",
      title: "Course Approvals",
      icon: <ChecklistIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/Csreporting",
      title: "CS Reporting",
      icon: <BarChartIcon />,
      allowedRoles: ["admin"],
    },
    {
      segment: "admin/Counselorapproval",
      title: "Counselor Approval",
      icon: <PsychologyIcon />,
      allowedRoles: ["admin"],
    },

    // Trainer Dashboard
    {
      segment: "trainer",
      title: "Trainer Dashboard",
      icon: <DashboardIcon />,
      allowedRoles: ["trainer"],
    },
    // #
    //     {
    //   segment: "trainer/assignment",
    //   title: "Create Assignment",
    //   icon: <DescriptionIcon />,
    //   allowedRoles: ["trainer"],
    // },
    //     {
    //   segment: "trainer/create-project-task",
    //   title: "Create Task",
    //   icon: <ChecklistIcon />,
    //   allowedRoles: ["trainer"],
    // },
    //     {
    //   segment: "trainer/manage-uploads",
    //   title: "Manage Uploads",
    //   icon: <CloudUploadIcon />,
    //   allowedRoles: ["trainer"],
    // },
    // #
    {
      segment: "trainer/topic-create",
      title: "Create Topic",
      icon: <TopicIcon />,
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
      icon: <GradeIcon />,
      allowedRoles: ["trainer"],
    },
    
    {
      segment: "trainer/Mockinterview",
      title: "Mock Interviews",
      icon: <VideoCallIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "trainer/Socialdrives",
      title: "Social Drives",
      icon: <Diversity3Icon />,
      allowedRoles: ["trainer"],
    },
    { 
      segment: "Internships",
      title: "Manage Internships",
      icon: <BusinessCenterIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "trainer/Csrdetails",
      title: "CSR Details",
      icon: <DescriptionIcon />,
      allowedRoles: ["trainer"],
    },
    {
      segment: "trainer/Counselor",
      title: "Counselor Tools",
      icon: <PsychologyIcon />,
      allowedRoles: ["trainer"],
    },

    // Vendor Dashboard
    {
      segment: "vendor",
      title: "Vendor Profile",
      icon: <PersonIcon />,
      allowedRoles: ["vendor"],
    },
    {
      segment: "vendor/socialservice",
      title: "Social Service",
      icon: <Diversity3Icon />,
      allowedRoles: ["vendor"],
    },
    {
      segment: "vendor/internships-and-events",
      title: "Internships & Events",
      icon: <BusinessCenterIcon />,
      allowedRoles: ["vendor"],
    },
    
    // Common items
    {
      segment: "BloodRequestPage",
      title: "Blood Emergency",
      icon: <Bloodtype />,
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
  const roleInfo = getRoleInfo();

  const drawerWidth = isCollapsed ? 72 : 280;

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: customTheme.palette.background.default,
        }}
      >
        <Drawer
          container={container}
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            transition: customTheme.transitions.create('width', {
              easing: customTheme.transitions.easing.sharp,
              duration: customTheme.transitions.duration.enteringScreen,
            }),
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              transition: customTheme.transitions.create('width', {
                easing: customTheme.transitions.easing.sharp,
                duration: customTheme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
              overflowY: 'auto',
              background: `linear-gradient(180deg, ${customTheme.palette.background.paper} 0%, ${alpha(customTheme.palette.primary.main, 0.02)} 100%)`,
              borderRight: `1px solid ${alpha(customTheme.palette.divider, 0.12)}`,
              boxShadow: '0 0 20px rgba(0,0,0,0.08)',
              // Hide scrollbar for webkit browsers
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              // Hide scrollbar for IE, Edge and Firefox
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            },
          }}
        >
          {/* Header Section */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              m: 1,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(roleInfo.color, 0.1)} 0%, ${alpha(roleInfo.color, 0.05)} 100%)`,
              border: `1px solid ${alpha(roleInfo.color, 0.2)}`,
            }}
          >
            {!isCollapsed ? (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <img
                    src={themeMode === "light" ? LOGO_BLACK : LOGO_WHITE}
                    alt="Great Minds Technology"
                    style={{ maxWidth: "60%", height: "auto" }}
                  />
                </Box>
                
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      mx: 'auto',
                      mb: 1,
                      bgcolor: roleInfo.color,
                      fontSize: 20
                    }}
                  >
                    {roleInfo.icon}
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 0.5,
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%'
                    }}
                    title={userName} // Show full name on hover
                  >
                    {userName}
                  </Typography>
                  <Chip
                    label={roleInfo.description}
                    size="small"
                    sx={{
                      bgcolor: alpha(roleInfo.color, 0.1),
                      color: roleInfo.color,
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LightMode sx={{ fontSize: 18, mr: 1 }} />
                    <Switch
                      checked={themeMode === 'dark'}
                      onChange={(e) => setThemeMode(e.target.checked ? 'dark' : 'light')}
                      size="small"
                    />
                    <DarkMode sx={{ fontSize: 18, ml: 1 }} />
                  </Box>
                  
                  <Tooltip title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
                    <IconButton
                      onClick={() => {
                        console.log('Toggling collapse:', !isCollapsed);
                        setIsCollapsed(!isCollapsed);
                      }}
                      size="small"
                      sx={{
                        bgcolor: alpha(customTheme.palette.primary.main, 0.1),
                        '&:hover': {
                          bgcolor: alpha(customTheme.palette.primary.main, 0.2),
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <MenuIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Tooltip title={`${userName} - ${roleInfo.description}`}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      mx: 'auto',
                      mb: 1,
                      bgcolor: roleInfo.color,
                    }}
                  >
                    {roleInfo.icon}
                  </Avatar>
                </Tooltip>
                
                <Tooltip title="Expand Sidebar">
                  <IconButton
                    onClick={() => {
                      console.log('Expanding sidebar');
                      setIsCollapsed(false);
                    }}
                    size="small"
                    sx={{ 
                      mb: 1,
                      bgcolor: alpha(customTheme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(customTheme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}>
                  <IconButton
                    onClick={() => {
                      const newTheme = themeMode === 'light' ? 'dark' : 'light';
                      console.log('Switching theme to:', newTheme);
                      setThemeMode(newTheme);
                    }}
                    size="small"
                  >
                    {themeMode === 'light' ? <DarkMode /> : <LightMode />}
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Paper>

          <Divider sx={{ my: 1 }} />

          {/* Navigation */}
          <List sx={{ px: 1, flex: 1 }}>
            {navItems.map((item, index) => {
              const isActive = location.pathname === `/dashboard/${item.segment}` || 
                             (item.segment === "" && location.pathname === "/dashboard");

              if (item.children && item.segment === "Events") {
                return (
                  <React.Fragment key={item.segment}>
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={handleEventsToggle}
                        sx={{
                          borderRadius: 2,
                          mx: 0.5,
                          '&:hover': {
                            bgcolor: alpha(customTheme.palette.primary.main, 0.08),
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {item.icon}
                        </ListItemIcon>
                        {!isCollapsed && (
                          <>
                            <ListItemText 
                              primary={item.title}
                              primaryTypographyProps={{
                                fontSize: '0.875rem',
                                fontWeight: 500
                              }}
                            />
                            {openEvents ? <ExpandLess /> : <ExpandMore />}
                          </>
                        )}
                      </ListItemButton>
                    </ListItem>
                    <Collapse in={openEvents && !isCollapsed} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.children.map((child) => (
                          <ListItem key={child.segment} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                              sx={{
                                borderRadius: 2,
                                mx: 0.5,
                                pl: 4,
                                '&:hover': {
                                  bgcolor: alpha(customTheme.palette.primary.main, 0.08),
                                }
                              }}
                              onClick={() => {
                                navigate(`/dashboard/${item.segment}/${child.segment}`);
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 40 }}>
                                {child.icon}
                              </ListItemIcon>
                              <ListItemText 
                                primary={child.title}
                                primaryTypographyProps={{
                                  fontSize: '0.8rem',
                                  fontWeight: 500
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
              }

              return (
                <ListItem key={item.segment || item.key || index} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={isActive}
                    onClick={
                      item.onClick 
                        ? item.onClick 
                        : () => {
                            console.log("Navigating to:", `/dashboard/${item.segment || ''}`);
                            navigate(`/dashboard/${item.segment || ''}`);
                          }
                    }
                    sx={{
                      borderRadius: 2,
                      mx: 0.5,
                      minHeight: 48,
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(customTheme.palette.primary.main, 0.08),
                        transform: isCollapsed ? 'none' : 'translateX(4px)',
                      },
                      '&.Mui-selected': {
                        bgcolor: alpha(customTheme.palette.primary.main, 0.12),
                        color: customTheme.palette.primary.main,
                        '&:hover': {
                          bgcolor: alpha(customTheme.palette.primary.main, 0.16),
                        },
                        '& .MuiListItemIcon-root': {
                          color: customTheme.palette.primary.main,
                        }
                      }
                    }}
                  >
                    <Tooltip title={isCollapsed ? item.title : ""} placement="right">
                      <ListItemIcon sx={{ 
                        minWidth: isCollapsed ? 'unset' : 40, 
                        justifyContent: 'center',
                        transition: 'color 0.2s ease' 
                      }}>
                        {item.icon}
                      </ListItemIcon>
                    </Tooltip>
                    {!isCollapsed && (
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isActive ? 600 : 500,
                        }}
                      />
                    )}
                    {isActive && !isCollapsed && (
                      <Box
                        sx={{
                          width: 4,
                          height: 20,
                          bgcolor: customTheme.palette.primary.main,
                          borderRadius: 2,
                          ml: 1
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {/* Footer */}
          {!isCollapsed && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                m: 1,
                borderRadius: 2,
                bgcolor: alpha(customTheme.palette.primary.main, 0.05),
                textAlign: 'center'
              }}
            >
              <Typography variant="caption" color="text.secondary">
                © 2024 Great Minds Technology
              </Typography>
            </Paper>
          )}
        </Drawer>

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            width: `calc(100vw - ${drawerWidth}px)`,
            overflow: 'hidden', // This prevents horizontal scroll
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto',
            p: 0,
            // Hide scrollbar for webkit browsers
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            // Hide scrollbar for IE, Edge and Firefox
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}