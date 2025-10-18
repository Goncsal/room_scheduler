import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { scheduleAPI, roomAPI } from '../services/api';
import { format } from 'date-fns';

const HomePage = () => {
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    activeSchedules: 0,
    availableRooms: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesRes, roomsRes] = await Promise.all([
          scheduleAPI.getTodaySchedule(),
          roomAPI.getAll()
        ]);

        setTodaySchedules(schedulesRes.data.schedules || []);
        const rooms = roomsRes.data || [];
        
        setStats({
          totalRooms: rooms.length,
          activeSchedules: schedulesRes.data.schedules?.length || 0,
          availableRooms: rooms.filter(room => !room.current_schedule).length
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'in_progress': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom>
        University Room Scheduler
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Manage and view room schedules with QR code access
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Rooms
              </Typography>
              <Typography variant="h4">
                {stats.totalRooms}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today's Schedules
              </Typography>
              <Typography variant="h4">
                {stats.activeSchedules}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Available Rooms
              </Typography>
              <Typography variant="h4">
                {stats.availableRooms}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" component={Link} to="/rooms">
              View All Rooms
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" component={Link} to="/schedules">
              Manage Schedules
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Today's Schedules */}
      <Typography variant="h5" gutterBottom>
        Today's Schedule ({format(new Date(), 'MMMM do, yyyy')})
      </Typography>
      {todaySchedules.length === 0 ? (
        <Typography color="textSecondary">
          No schedules for today.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {todaySchedules.map((schedule) => (
            <Grid item xs={12} sm={6} md={4} key={schedule.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {schedule.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {schedule.room_name} ({schedule.room_number})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {schedule.department_name}
                  </Typography>
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Typography variant="body1">
                      {schedule.start_time} - {schedule.end_time}
                    </Typography>
                  </Box>
                  {schedule.instructor && (
                    <Typography variant="body2">
                      Instructor: {schedule.instructor}
                    </Typography>
                  )}
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={schedule.status} 
                      color={getStatusColor(schedule.status)}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;
