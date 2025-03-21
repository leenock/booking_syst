import { AuthError } from '../types/auth';

export const validatePassword = (password: string): AuthError | null => {
  if (password.length < 8) {
    return {
      field: 'password',
      message: 'Password must be at least 8 characters long'
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      field: 'password',
      message: 'Password must contain at least one uppercase letter'
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      field: 'password',
      message: 'Password must contain at least one lowercase letter'
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      field: 'password',
      message: 'Password must contain at least one number'
    };
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return {
      field: 'password',
      message: 'Password must contain at least one special character (!@#$%^&*)'
    };
  }

  return null;
};

export const validateEmail = (email: string): AuthError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      field: 'email',
      message: 'Please enter a valid email address'
    };
  }
  return null;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
}; 