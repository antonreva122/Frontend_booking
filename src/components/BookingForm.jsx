import { useState, useEffect, useCallback } from 'react';
import { bookingAPI, resourceAPI } from '../services/bookingService';
import { handleApiError } from '../utils/errorUtils';
import { getTodayFormatted } from '../utils/dateUtils';
import './BookingForm.css';

function BookingForm({ booking, onClose }) {
  const [formData, setFormData] = useState({
    resource: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    notes: '',
  });
  const [resources, setResources] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResources();
    
    if (booking) {
      setFormData({
        resource: booking.resource,
        booking_date: booking.booking_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        notes: booking.notes || '',
      });
    } else {
      setFormData(prev => ({
        ...prev,
        booking_date: getTodayFormatted(),
      }));
    }
  }, [booking]);

  const fetchResources = async () => {
    try {
      const data = await resourceAPI.getAvailableResources();
      setResources(data);
    } catch (err) {
      console.error('Error fetching resources:', err);
    }
  };

  const checkAvailability = useCallback(async () => {
    if (!formData.resource || !formData.booking_date) return;

    try {
      const data = await bookingAPI.checkAvailability(
        formData.resource,
        formData.booking_date
      );
      setAvailability(data);
    } catch (err) {
      console.error('Error checking availability:', err);
    }
  }, [formData.resource, formData.booking_date]);

  useEffect(() => {
    if (formData.resource && formData.booking_date) {
      checkAvailability();
    }
  }, [formData.resource, formData.booking_date, checkAvailability]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.end_time <= formData.start_time) {
      setError('End time must be after start time');
      setLoading(false);
      return;
    }

    try {
      if (booking) {
        await bookingAPI.updateBooking(booking.id, formData);
      } else {
        await bookingAPI.createBooking(formData);
      }
      onClose(true); // true = should refresh
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const selectedResource = resources.find(r => r.id === parseInt(formData.resource));

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{booking ? 'Edit Booking' : 'Create New Booking'}</h2>
          <button className="modal-close" onClick={() => onClose(false)}>
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="resource">Resource *</label>
            <select
              id="resource"
              name="resource"
              value={formData.resource}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select a resource</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name} ({resource.resource_type})
                  {resource.price_per_hour && ` - $${resource.price_per_hour}/hr`}
                </option>
              ))}
            </select>
          </div>

          {selectedResource && (
            <div className="resource-info">
              <p><strong>Description:</strong> {selectedResource.description || 'No description'}</p>
              <p><strong>Capacity:</strong> {selectedResource.capacity}</p>
              {selectedResource.location && (
                <p><strong>Location:</strong> {selectedResource.location}</p>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="booking_date">Date *</label>
            <input
              type="date"
              id="booking_date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              min={getTodayFormatted()}
              required
              disabled={loading}
            />
          </div>

          {availability && (
            <div className="availability-info">
              <h4>Booked Time Slots for {formData.booking_date}:</h4>
              {availability.booked_slots.length === 0 ? (
                <p className="available">✅ No bookings - fully available!</p>
              ) : (
                <ul>
                  {availability.booked_slots.map((slot, index) => (
                    <li key={index}>
                      ❌ {slot.start_time} - {slot.end_time}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_time">Start Time *</label>
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_time">End Time *</label>
              <input
                type="time"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Add any additional notes..."
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => onClose(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : booking ? 'Update Booking' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
