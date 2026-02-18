import { format, parseISO } from 'date-fns';

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

/**
 * Format time for display
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  try {
    // timeString is "HH:mm:ss"
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  } catch (error) {
    return timeString;
  }
};

/**
 * Format datetime for display
 */
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  try {
    return format(parseISO(dateTimeString), 'MMM dd, yyyy h:mm a');
  } catch (error) {
    return dateTimeString;
  }
};

/**
 * Format date for input (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  try {
    return format(new Date(date), 'yyyy-MM-dd');
  } catch (error) {
    return '';
  }
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayFormatted = () => {
  return format(new Date(), 'yyyy-MM-dd');
};
