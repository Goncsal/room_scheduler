import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Modal,
  Paper,
  IconButton,
} from '@mui/material';
import { QrCode, Visibility, Close } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { roomAPI, departmentAPI } from '../services/api';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    type: '',
    search: ''
  });
  const [qrDialog, setQrDialog] = useState({ open: false, room: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
    fetchDepartments();
  }, [filters]);

  const fetchRooms = async () => {
    try {
      const params = {};
      if (filters.department) params.department = filters.department;
      if (filters.type) params.type = filters.type;
      if (filters.search) params.search = filters.search;

      const response = await roomAPI.getAll(params);
      setRooms(response.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
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

  const getAvailabilityStatus = (room) => {
    if (room.current_schedule) {
      return { text: 'Occupied', color: 'error' };
    }
    return { text: 'Available', color: 'success' };
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
      <Typography variant="h4" gutterBottom>
        Rooms
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={filters.department}
                label="Department"
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <MenuItem value="">All Departments</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Room Type</InputLabel>
              <Select
                value={filters.type}
                label="Room Type"
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="classroom">Classroom</MenuItem>
                <MenuItem value="laboratory">Laboratory</MenuItem>
                <MenuItem value="auditorium">Auditorium</MenuItem>
                <MenuItem value="conference">Conference Room</MenuItem>
                <MenuItem value="office">Office</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Room name, number, equipment..."
            />
          </Grid>
        </Grid>
      </Box>

      {/* Room Cards */}
      <Grid container spacing={3}>
        {rooms.map((room) => {
          const availability = getAvailabilityStatus(room);
          return (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {room.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Room {room.number} • {room.department_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Capacity: {room.capacity}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={room.room_type} 
                      color={getRoomTypeColor(room.room_type)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={availability.text}
                      color={availability.color}
                      size="small"
                    />
                  </Box>
                  
                  {room.current_schedule && (
                    <Box sx={{ p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>Current:</strong> {room.current_schedule.title}
                      </Typography>
                      <Typography variant="body2">
                        {room.current_schedule.start_time} - {room.current_schedule.end_time}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/rooms/${room.id}`}
                    startIcon={<Visibility />}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => setQrDialog({ open: true, room })}
                    startIcon={<QrCode />}
                  >
                    QR Code
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {rooms.length === 0 && (
        <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 4 }}>
          No rooms found. Try adjusting your filters.
        </Typography>
      )}

      {/* QR Code Modal */}
      <Modal
        open={qrDialog.open}
        onClose={() => setQrDialog({ open: false, room: null })}
        aria-labelledby="qr-modal-title"
        aria-describedby="qr-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            maxWidth: 500,
          }}
        >
          <Paper
            sx={{
              p: 3,
              outline: 'none',
              position: 'relative',
            }}
          >
            <IconButton
              onClick={() => setQrDialog({ open: false, room: null })}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
              aria-label="Close QR code modal"
            >
              <Close />
            </IconButton>
            
            <Typography id="qr-modal-title" variant="h6" component="h2" sx={{ mb: 2, pr: 4 }}>
              QR Code for {qrDialog.room?.name}
            </Typography>
            
            <Box id="qr-modal-description">
              {qrDialog.room?.qr_code_url ? (
                <Box sx={{ textAlign: 'center' }}>
                  <img 
                    src={qrDialog.room.qr_code_url} 
                    alt={`QR Code for ${qrDialog.room.name}`}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Scan to view room schedule
                  </Typography>
                </Box>
              ) : (
                <Typography>QR Code not available</Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Modal>
    </Container>
  );
};

export default RoomsPage;
