import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ButtonGroup,
} from '@mui/material';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

const Timetable = ({ schedules, onScheduleClick, viewMode = 'week' }) => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [timeSlots] = useState([
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ]);

  // Get unique rooms from schedules
  const rooms = [...new Set(schedules.map(s => s.room_name))].sort();

  // Get days of the week starting from Monday
  const getWeekDays = () => {
    const start = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDays = getWeekDays();
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Filter schedules based on selected room and week
  const filteredSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    const isInWeek = weekDays.some(day => isSameDay(day, scheduleDate));
    const isRoomMatch = selectedRoom === 'all' || schedule.room_name === selectedRoom;
    return isInWeek && isRoomMatch;
  });

  // Find schedule for specific day and time slot
  const getScheduleForSlot = (day, timeSlot, room = null) => {
    return filteredSchedules.find(schedule => {
      const scheduleDate = new Date(schedule.date);
      const isCorrectDay = isSameDay(scheduleDate, day);
      const isCorrectRoom = room ? schedule.room_name === room : true;
      
      if (!isCorrectDay || !isCorrectRoom) return false;

      const startTime = schedule.start_time.substring(0, 5); // HH:MM format
      const endTime = schedule.end_time.substring(0, 5);
      
      return startTime <= timeSlot && timeSlot < endTime;
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'in_progress': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Navigation for weeks
  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedWeek(newDate);
  };

  const renderWeekView = () => (
    <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflow: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 80, backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
              Time
            </TableCell>
            {weekDays.map((day, index) => (
              <TableCell 
                key={day.toISOString()} 
                align="center" 
                sx={{ 
                  minWidth: 150, 
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold'
                }}
              >
                <Typography variant="subtitle2">
                  {dayNames[index]}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {format(day, 'MMM dd')}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {timeSlots.map((timeSlot) => (
            <TableRow key={timeSlot} sx={{ height: 80 }}>
              <TableCell 
                sx={{ 
                  backgroundColor: '#fafafa',
                  fontWeight: 'bold',
                  borderRight: '2px solid #e0e0e0'
                }}
              >
                {timeSlot}
              </TableCell>
              {weekDays.map((day) => {
                const schedule = getScheduleForSlot(day, timeSlot);
                return (
                  <TableCell 
                    key={`${day.toISOString()}-${timeSlot}`}
                    sx={{ 
                      p: 0.5,
                      borderRight: '1px solid #e0e0e0',
                      cursor: schedule ? 'pointer' : 'default',
                      '&:hover': schedule ? { backgroundColor: '#f0f0f0' } : {}
                    }}
                    onClick={() => schedule && onScheduleClick && onScheduleClick(schedule)}
                  >
                    {schedule && (
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: getStatusColor(schedule.status) === 'primary' ? '#e3f2fd' :
                                         getStatusColor(schedule.status) === 'success' ? '#e8f5e8' :
                                         getStatusColor(schedule.status) === 'error' ? '#ffebee' : '#f5f5f5',
                          borderLeft: `4px solid ${
                            getStatusColor(schedule.status) === 'primary' ? '#2196f3' :
                            getStatusColor(schedule.status) === 'success' ? '#4caf50' :
                            getStatusColor(schedule.status) === 'error' ? '#f44336' : '#9e9e9e'
                          }`,
                          height: '100%',
                          minHeight: 60
                        }}
                      >
                        <Typography variant="caption" fontWeight="bold" display="block">
                          {schedule.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          {schedule.room_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          {schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}
                        </Typography>
                        {schedule.instructor && (
                          <Typography variant="caption" color="textSecondary" display="block">
                            {schedule.instructor}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderRoomView = () => (
    <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflow: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 80, backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
              Time
            </TableCell>
            {rooms.map((room) => (
              <TableCell 
                key={room} 
                align="center" 
                sx={{ 
                  minWidth: 200, 
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold'
                }}
              >
                {room}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {timeSlots.map((timeSlot) => (
            <TableRow key={timeSlot} sx={{ height: 80 }}>
              <TableCell 
                sx={{ 
                  backgroundColor: '#fafafa',
                  fontWeight: 'bold',
                  borderRight: '2px solid #e0e0e0'
                }}
              >
                {timeSlot}
              </TableCell>
              {rooms.map((room) => {
                // Find schedule for this room and time across all days in the week
                const todaySchedules = filteredSchedules.filter(schedule => {
                  const scheduleDate = new Date(schedule.date);
                  const isToday = weekDays.some(day => isSameDay(day, scheduleDate));
                  const isCorrectRoom = schedule.room_name === room;
                  const startTime = schedule.start_time.substring(0, 5);
                  const endTime = schedule.end_time.substring(0, 5);
                  return isToday && isCorrectRoom && startTime <= timeSlot && timeSlot < endTime;
                });

                return (
                  <TableCell 
                    key={`${room}-${timeSlot}`}
                    sx={{ 
                      p: 0.5,
                      borderRight: '1px solid #e0e0e0'
                    }}
                  >
                    {todaySchedules.map((schedule) => (
                      <Box
                        key={schedule.id}
                        sx={{
                          mb: 0.5,
                          p: 0.5,
                          borderRadius: 1,
                          backgroundColor: getStatusColor(schedule.status) === 'primary' ? '#e3f2fd' :
                                         getStatusColor(schedule.status) === 'success' ? '#e8f5e8' :
                                         getStatusColor(schedule.status) === 'error' ? '#ffebee' : '#f5f5f5',
                          borderLeft: `3px solid ${
                            getStatusColor(schedule.status) === 'primary' ? '#2196f3' :
                            getStatusColor(schedule.status) === 'success' ? '#4caf50' :
                            getStatusColor(schedule.status) === 'error' ? '#f44336' : '#9e9e9e'
                          }`,
                          cursor: 'pointer'
                        }}
                        onClick={() => onScheduleClick && onScheduleClick(schedule)}
                      >
                        <Typography variant="caption" fontWeight="bold" display="block">
                          {schedule.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          {format(new Date(schedule.date), 'EEE')} {schedule.start_time.substring(0, 5)}-{schedule.end_time.substring(0, 5)}
                        </Typography>
                      </Box>
                    ))}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      {/* Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <ButtonGroup>
          <Button onClick={() => navigateWeek(-1)}>Previous Week</Button>
          <Button onClick={() => setSelectedWeek(new Date())}>This Week</Button>
          <Button onClick={() => navigateWeek(1)}>Next Week</Button>
        </ButtonGroup>

        <Typography variant="h6" sx={{ mx: 2 }}>
          Week of {format(weekDays[0], 'MMM dd, yyyy')}
        </Typography>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Room Filter</InputLabel>
          <Select
            value={selectedRoom}
            label="Room Filter"
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            <MenuItem value="all">All Rooms</MenuItem>
            {rooms.map((room) => (
              <MenuItem key={room} value={room}>
                {room}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Legend */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Chip label="Scheduled" color="primary" size="small" />
        <Chip label="In Progress" color="success" size="small" />
        <Chip label="Completed" color="default" size="small" />
        <Chip label="Cancelled" color="error" size="small" />
      </Box>

      {/* Timetable */}
      {viewMode === 'week' ? renderWeekView() : renderRoomView()}

      {filteredSchedules.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="textSecondary">
            No schedules found for the selected week and room filter.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Timetable;
