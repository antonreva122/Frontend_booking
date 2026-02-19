import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../services/bookingService';
import { handleApiError } from '../utils/errorUtils';
import { formatDate, formatTime } from '../utils/dateUtils';
import BookingForm from '../components/BookingForm';
import './Bookings.css';

function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    // Clear bookings when user changes
    setBookings([]);
    fetchBookings();
  }, [filter, user]); // Re-fetch when filter OR user changes

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    
    try {
      let data;
      if (filter === 'upcoming') {
        data = await bookingAPI.getUpcomingBookings();
      } else if (filter === 'past') {
        data = await bookingAPI.getPastBookings();
      } else {
        data = await bookingAPI.getBookings();
      }
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setBookings(data);
      } else if (data && Array.isArray(data.results)) {
        // Handle paginated response
        setBookings(data.results);
      } else {
        console.error('Unexpected API response format:', data);
        setBookings([]);
        setError('Failed to load bookings. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(handleApiError(err));
      setBookings([]); // Ensure bookings is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = () => {
    setEditingBooking(null);
    setShowForm(true);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setShowForm(true);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingAPI.cancelBooking(bookingId);
      fetchBookings();
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await bookingAPI.deleteBooking(bookingId);
      fetchBookings();
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  const handleFormClose = (shouldRefresh) => {
    setShowForm(false);
    setEditingBooking(null);
    if (shouldRefresh) {
      fetchBookings();
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      PENDING: 'status-pending',
      CONFIRMED: 'status-confirmed',
      CANCELLED: 'status-cancelled',
      COMPLETED: 'status-completed',
    };
    return <span className={`status-badge ${statusClasses[status]}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="loading">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <button className="bookings-create-btn" onClick={handleCreateBooking}>
          + Create Booking
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="bookings-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Bookings
        </button>
        <button
          className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
          onClick={() => setFilter('past')}
        >
          Past
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bookings-empty">
          <p>📅 No bookings found</p>
          <p>Create your first booking to get started!</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-card-header">
                <h3>{booking.resource_details?.name || 'Resource'}</h3>
                {getStatusBadge(booking.status)}
              </div>

              <div className="booking-card-body">
                <div className="booking-info">
                  <span className="info-label">📅 Date:</span>
                  <span>{formatDate(booking.booking_date)}</span>
                </div>

                <div className="booking-info">
                  <span className="info-label">🕐 Time:</span>
                  <span>
                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                  </span>
                </div>

                <div className="booking-info">
                  <span className="info-label">⏱️ Duration:</span>
                  <span>{booking.duration_hours} hours</span>
                </div>

                {booking.resource_details?.price_per_hour && (
                  <div className="booking-info">
                    <span className="info-label">💰 Price:</span>
                    <span>${booking.total_price?.toFixed(2)}</span>
                  </div>
                )}

                {booking.notes && (
                  <div className="booking-info">
                    <span className="info-label">📝 Notes:</span>
                    <span>{booking.notes}</span>
                  </div>
                )}
              </div>

              <div className="booking-card-footer">
                {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                  <>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditBooking(booking)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteBooking(booking.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BookingForm
          booking={editingBooking}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}

export default Bookings;
