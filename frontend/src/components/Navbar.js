import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Home, MeetingRoom, Schedule } from '@mui/icons-material';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <Home /> },
    { path: '/rooms', label: 'Rooms', icon: <MeetingRoom /> },
    { path: '/schedules', label: 'Schedules', icon: <Schedule /> },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Room Scheduler
        </Typography>
        <Box sx={{ display: 'flex' }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={RouterLink}
              to={item.path}
              startIcon={item.icon}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
