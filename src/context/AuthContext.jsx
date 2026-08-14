// Session layer on top of authService. authService.login() only checks a
// row match (see its own comments on this being a front-end-only demo) —
// it doesn't persist anything. This context is what remembers who's signed
// in across a page refresh, and resolves the linked patient/staff record so
// pages don't each have to do that lookup themselves.

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useMediflowData } from './DataContext.jsx';

const SESSION_KEY = 'mediflow:session';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { authService, patientService, staffService, isReady } = useMediflowData();
  const [userId, setUserId] = useState(() => window.localStorage.getItem(SESSION_KEY));
  const [error, setError] = useState(null);

  // If the seeded user set ever changes shape, don't get stuck on a stale session.
  useEffect(() => {
    if (!isReady || !userId) return;
    if (!authService.getUserById(userId)) {
      window.localStorage.removeItem(SESSION_KEY);
      setUserId(null);
    }
  }, [isReady, userId, authService]);

  const login = useCallback((email, password) => {
    const user = authService.login(email, password);
    if (!user) {
      setError('Email or password is incorrect.');
      return null;
    }
    setError(null);
    window.localStorage.setItem(SESSION_KEY, user.user_id);
    setUserId(user.user_id);
    return user;
  }, [authService]);

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setUserId(null);
  }, []);

  const user = userId ? authService.getUserById(userId) : null;
  const patient = user?.role === 'patient' ? patientService.getPatientByUserId(user.user_id) : null;
  const staff = user?.role === 'staff' || user?.role === 'admin' ? staffService.getStaffByUserId(user.user_id) : null;

  const value = {
    user,
    patient,
    staff,
    role: user?.role ?? null,
    isAuthenticated: Boolean(user),
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>');
  return ctx;
}
