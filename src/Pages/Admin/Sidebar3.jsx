import React, { useEffect } from 'react';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import TaskIcon from '@mui/icons-material/Task';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import FreeCancellationIcon from '@mui/icons-material/FreeCancellation';
import SpeedIcon from '@mui/icons-material/Speed';
import LogoutIcon from '@mui/icons-material/Logout';

import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

export default function GMTSideBar({ window }) {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Logout function
  const handleLogout = () => {
    console.log("Logout triggered, clearing storage and navigating to /login");
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  // ✅ Navigation items (excluding Logout from here)
  const NAVIGATION = [
    { kind: 'header', title: 'Admin Dashboard' },
    {
      segment: '/admin',
      title: 'Dashboard',
      icon: <LibraryBooksIcon />,
    },
    {
      segment: '/admin/students',
      title: 'Student',
      icon: <SettingsInputAntennaIcon />,
    },
    {
      segment: '/admin/trainer',
      title: 'Trainer Approval',
      icon: <TaskIcon />,
    },
    {
      segment: '/admin/vendor',
      title: 'Vendor Approval',
      icon: <InterpreterModeIcon />,
    },
    {
      segment: '/admin/coursecounts',
      title: 'Courses Count',
      icon: <FreeCancellationIcon />,
    },
    {
      segment: '/admin/coursestudents',
      title: 'Courses Student',
      icon: <SpeedIcon />,
    },
    {
      segment: '/admin/courselist',
      title: 'Courses List',
      icon: <SpeedIcon />,
    },
    <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  ];

  const demoTheme = createTheme({
    colorSchemes: { light: true, dark: true },
    cssVariables: {
      colorSchemeSelector: 'class',
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  useEffect(() => {
    const el = document.querySelector('.MuiTypography-h6');
    if (el && el.textContent.trim() === 'Toolpad') {
      el.textContent = 'Great Minds Technology';
    }
  }, []);

  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={{
        pathname: location.pathname,
        searchParams: new URLSearchParams(location.search),
        navigate: (path) => navigate(`/admin${path}`),
      }}
      // theme={demoTheme}
      // window={demoWindow}
    >
    <Box sx={{ p: 2, borderTop: '1px solid #ccc' }}>
    </Box>
    <DashboardLayout>
      <Box display="flex" flexDirection="column" height="100%">
          <Box flexGrow={1}>
            <Outlet />
          </Box>
      </Box>
    </DashboardLayout>
  </AppProvider>
  );
}
