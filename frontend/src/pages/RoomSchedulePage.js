import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { CalendarMonth, AccessTime, Group } from '@mui/icons-material';
import { scheduleAPI } from '../services/api';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';

const RoomSchedulePage = () => {
  const { id } = useParams();
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    fetchSchedule();
  }, [id, weekOffset]);

  const fetchSchedule = async () => {
    try {
      const today = new Date();
      const targetWeek = addDays(today, weekOffset * 7);
      const startDate = startOfWeek(targetWeek, { weekStartsOn: 1 }); // Monday
      const endDate = endOfWeek(targetWeek, { weekStartsOn: 1 }); // Sunday

      const response = await scheduleAPI.getRoomSchedule(id, {
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
      });

      setScheduleData(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'in_progress': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return format(date, 'EEEE, MMM do');
  };

  const generateWeekDays = () => {
    if (!scheduleData) return [];
    
    const startDate = new Date(scheduleData.start_date);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const daySchedules = scheduleData.schedules[dateStr] || [];
      
      days.push({
        date: dateStr,
        displayDate: getDayName(dateStr),
        schedules: daySchedules,
      });
    }
    
    return days;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading schedule...</Typography>
      </Container>
    );
  }

  if (!scheduleData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Schedule not found</Typography>
      </Container>
    );
  }

  const weekDays = generateWeekDays();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {scheduleData.room.name} Schedule
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Room {scheduleData.room.number} • {scheduleData.room.department}
        </Typography>
        
        {/* Room Info Cards */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CalendarMonth color="primary" />
                <Typography variant="h6">{scheduleData.room.room_type}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Room Type
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Group color="primary" />
                <Typography variant="h6">{scheduleData.room.capacity}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Capacity
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AccessTime color="primary" />
                <Typography variant="h6">
                  {Object.values(scheduleData.schedules).reduce((total, daySchedules) => total + daySchedules.length, 0)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  This Week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Week Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button 
          variant="outlined" 
          onClick={() => setWeekOffset(weekOffset - 1)}
        >
          Previous Week
        </Button>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
          Week of {format(new Date(scheduleData.start_date), 'MMM do, yyyy')}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => setWeekOffset(weekOffset + 1)}
        >
          Next Week
        </Button>
      </Box>

      {/* Daily Schedule */}
      <Grid container spacing={2}>
        {weekDays.map((day) => (
          <Grid item xs={12} key={day.date}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  pb: 1,
                  mb: 2 
                }}>
                  {day.displayDate}
                </Typography>
                
                {day.schedules.length === 0 ? (
                  <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                    No classes scheduled
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {day.schedules.map((schedule) => (
                      <Card key={schedule.id} variant="outlined">
                        <CardContent sx={{ py: 2 }}>
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={3}>
                              <Typography variant="body1" fontWeight="bold">
                                {schedule.start_time} - {schedule.end_time}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                              <Typography variant="h6">
                                {schedule.title}
                              </Typography>
                              {schedule.course_code && (
                                <Typography variant="body2" color="textSecondary">
                                  {schedule.course_code}
                                </Typography>
                              )}
                              {schedule.instructor && (
                                <Typography variant="body2">
                                  Instructor: {schedule.instructor}
                                </Typography>
                              )}
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <Chip 
                                label={schedule.status} 
                                color={getStatusColor(schedule.status)}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <Typography variant="body2" color="textSecondary">
                                {schedule.duration_minutes} min
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RoomSchedulePage;
