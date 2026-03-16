import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatTime,
  formatDateTime,
  formatDateForInput,
  getTodayFormatted,
} from '../dateUtils';

describe('formatDate', () => {
  it('formats ISO date string', () => {
    expect(formatDate('2026-03-15')).toBe('Mar 15, 2026');
  });

  it('returns empty string for falsy input', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  it('returns original string on invalid date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
});

describe('formatTime', () => {
  it('formats HH:mm:ss to 12-hour format', () => {
    expect(formatTime('14:30:00')).toBe('2:30 PM');
  });

  it('formats morning time', () => {
    expect(formatTime('09:00:00')).toBe('9:00 AM');
  });

  it('returns empty string for falsy input', () => {
    expect(formatTime('')).toBe('');
  });
});

describe('formatDateTime', () => {
  it('formats ISO datetime string', () => {
    const result = formatDateTime('2026-03-15T14:30:00');
    expect(result).toContain('Mar 15, 2026');
    expect(result).toContain('PM');
  });

  it('returns empty string for falsy input', () => {
    expect(formatDateTime('')).toBe('');
  });
});

describe('formatDateForInput', () => {
  it('formats date for input field', () => {
    expect(formatDateForInput('2026-03-15')).toBe('2026-03-15');
  });

  it('returns empty string for falsy input', () => {
    expect(formatDateForInput('')).toBe('');
    expect(formatDateForInput(null)).toBe('');
  });
});

describe('getTodayFormatted', () => {
  it('returns today in YYYY-MM-DD format', () => {
    const result = getTodayFormatted();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
