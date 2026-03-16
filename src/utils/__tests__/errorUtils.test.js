import { describe, it, expect } from 'vitest';
import { handleApiError, formatValidationErrors } from '../errorUtils';

describe('handleApiError', () => {
  it('handles 400 with object data', () => {
    const error = {
      response: {
        status: 400,
        data: { email: ['This field is required.'] },
      },
    };
    expect(handleApiError(error)).toBe('This field is required.');
  });

  it('handles 400 with error string', () => {
    const error = {
      response: {
        status: 400,
        data: { error: 'Invalid request' },
      },
    };
    expect(handleApiError(error)).toBe('Invalid request');
  });

  it('handles 401', () => {
    const error = { response: { status: 401, data: {} } };
    expect(handleApiError(error)).toBe('Unauthorized. Please login again.');
  });

  it('handles 403', () => {
    const error = { response: { status: 403, data: {} } };
    expect(handleApiError(error)).toContain('permission');
  });

  it('handles 404', () => {
    const error = { response: { status: 404, data: {} } };
    expect(handleApiError(error)).toBe('Resource not found.');
  });

  it('handles 500', () => {
    const error = { response: { status: 500, data: {} } };
    expect(handleApiError(error)).toContain('Server error');
  });

  it('handles network error', () => {
    const error = { request: {} };
    expect(handleApiError(error)).toContain('Network error');
  });

  it('handles generic error', () => {
    const error = { message: 'Something broke' };
    expect(handleApiError(error)).toBe('Something broke');
  });
});

describe('formatValidationErrors', () => {
  it('returns string as-is', () => {
    expect(formatValidationErrors('error')).toBe('error');
  });

  it('formats object errors', () => {
    const errors = {
      email: ['Invalid email'],
      password: 'Too short',
    };
    const result = formatValidationErrors(errors);
    expect(result).toContain('email: Invalid email');
    expect(result).toContain('password: Too short');
  });

  it('returns default for non-object/string', () => {
    expect(formatValidationErrors(42)).toBe('Validation error');
  });
});
