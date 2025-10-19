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
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { QrCode, Schedule, Edit, ViewWeek, List } from '@mui/icons-material';
import { roomAPI } from '../services/api';
import Timetable from '../components/Timetable';

const RoomDetailPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(0); // 0 = timetable, 1 = list

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const response = await roomAPI.getById(id);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoomTypeColor = (type) => {
    switch (type) {
      case 'classroom': return 'primary';
      case 'laboratory': return 'secondary';
      case 'auditorium': return 'success';
      case 'conference': return 'warning';
      case 'office': return 'info';
      default: return 'default';
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!room) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Room not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {room.name}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Room {room.number} • {room.department_name}
      </Typography>

      <Grid container spacing={3}>
        {/* Room Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Room Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Type</Typography>
                <Chip 
                  label={room.room_type} 
                  color={getRoomTypeColor(room.room_type)}
                  size="small"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Capacity</Typography>
                <Typography variant="body1">{room.capacity} people</Typography>
              </Box>
              {room.floor && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Floor</Typography>
                  <Typography variant="body1">{room.floor}</Typography>
                </Box>
              )}
              {room.building && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Building</Typography>
                  <Typography variant="body1">{room.building}</Typography>
                </Box>
              )}
              {room.equipment && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Equipment</Typography>
                  <Typography variant="body1">{room.equipment}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* QR Code */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                QR Code Access
              </Typography>
              {room.qr_code_url ? (
                <Box sx={{ textAlign: 'center' }}>
                  <img 
                    src={room.qr_code_url} 
                    alt={`QR Code for ${room.name}`}
                    style={{ maxWidth: '200px', height: 'auto', marginBottom: '16px' }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    Scan to view room schedule on mobile
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<QrCode />}
                      onClick={() => window.open(room.qr_code_url, '_blank')}
                    >
                      Download QR Code
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography color="textSecondary">
                  QR Code not available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Current Status */}
        {room.current_schedule && (
          <Grid item xs={12}>
            <Card sx={{ bgcolor: 'warning.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Currently Occupied
                </Typography>
                <Typography variant="body1">
                  <strong>{room.current_schedule.title}</strong>
                </Typography>
                <Typography variant="body2">
                  {room.current_schedule.start_time} - {room.current_schedule.end_time}
                </Typography>
                {room.current_schedule.instructor && (
                  <Typography variant="body2">
                    Instructor: {room.current_schedule.instructor}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Room Schedules */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Room Schedule
              </Typography>
              
              {/* View Mode Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={viewMode} onChange={(e, newValue) => setViewMode(newValue)}>
                  <Tab 
                    icon={<ViewWeek />} 
                    label="Timetable View" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<List />} 
                    label="List View" 
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              {room.schedules && room.schedules.length > 0 ? (
                viewMode === 0 ? (
                  // Timetable View
                  <Timetable 
                    schedules={room.schedules} 
                    onScheduleClick={() => {}} // Read-only for room detail
                  />
                ) : (
                  // List View
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Instructor</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {room.schedules.map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell>{schedule.date}</TableCell>
                            <TableCell>
                              {schedule.start_time} - {schedule.end_time}
                            </TableCell>
                            <TableCell>{schedule.title}</TableCell>
                            <TableCell>{schedule.instructor || '-'}</TableCell>
                            <TableCell>
                              <Chip 
                                label={schedule.status} 
                                color={getStatusColor(schedule.status)}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )
              ) : (
                <Typography color="textSecondary">
                  No schedules available for this room
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RoomDetailPage;
