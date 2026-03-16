import { describe, it, expect, beforeEach } from 'vitest';
import {
  isAuthenticated,
  getStoredUser,
  storeAuthData,
  clearAuthData,
} from '../authUtils';

describe('authUtils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('isAuthenticated', () => {
    it('returns false when no token', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true when token exists', () => {
      localStorage.setItem('accessToken', 'fake-token');
      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('getStoredUser', () => {
    it('returns null when no user stored', () => {
      expect(getStoredUser()).toBeNull();
    });

    it('returns parsed user object', () => {
      const user = { id: 1, email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(user));
      expect(getStoredUser()).toEqual(user);
    });
  });

  describe('storeAuthData', () => {
    it('stores tokens and user', () => {
      const tokens = { access: 'access-token', refresh: 'refresh-token' };
      const user = { id: 1, email: 'test@example.com' };
      storeAuthData(tokens, user);

      expect(localStorage.getItem('accessToken')).toBe('access-token');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
      expect(JSON.parse(localStorage.getItem('user'))).toEqual(user);
    });
  });

  describe('clearAuthData', () => {
    it('removes all auth data', () => {
      localStorage.setItem('accessToken', 'token');
      localStorage.setItem('refreshToken', 'token');
      localStorage.setItem('user', '{}');

      clearAuthData();

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });
});
