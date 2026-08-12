// Thin wrapper around the `users` table. This is a front-end-only demo, so
// "authentication" here just means matching email + password against a
// stored record — there's no real session handling or password hashing
// (the docs flag this honestly in §15 Testing / Scope and Limitations).

import { db } from '../data/repositories.js';

export const authService = {
  getAllUsers() {
    return db.users.getAll();
  },

  getUserById(userId) {
    return db.users.getById(userId);
  },

  getUserByEmail(email) {
    return db.users.getAll().find((user) => user.email === email) ?? null;
  },

  /** Mock login: returns the matching, active user record, or null. */
  login(email, password) {
    const user = this.getUserByEmail(email);
    if (!user || user.password !== password || !user.is_active) return null;
    return user;
  },

  createUser(data) {
    return db.users.create({ is_active: true, created_at: new Date().toISOString(), ...data });
  },

  deactivateUser(userId) {
    return db.users.update(userId, { is_active: false });
  },
};
