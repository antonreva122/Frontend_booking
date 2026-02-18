/**
 * Handle API errors and return user-friendly message
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { data, status } = error.response;
    
    if (status === 400) {
      // Validation errors
      if (typeof data === 'object') {
        // Extract first error message
        const firstError = Object.values(data)[0];
        return Array.isArray(firstError) ? firstError[0] : firstError;
      }
      return data.error || 'Invalid request';
    }
    
    if (status === 401) {
      return 'Unauthorized. Please login again.';
    }
    
    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    if (status === 404) {
      return 'Resource not found.';
    }
    
    if (status >= 500) {
      return 'Server error. Please try again later.';
    }
    
    return data.error || data.message || 'An error occurred';
  }
  
  if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  }
  
  // Something else happened
  return error.message || 'An unexpected error occurred';
};

/**
 * Format validation errors from API
 */
export const formatValidationErrors = (errors) => {
  if (typeof errors === 'string') return errors;
  
  if (typeof errors === 'object') {
    return Object.entries(errors)
      .map(([field, messages]) => {
        const message = Array.isArray(messages) ? messages[0] : messages;
        return `${field}: ${message}`;
      })
      .join('\n');
  }
  
  return 'Validation error';
};
