
import { UserProfile } from '../types';

const BASE_URL = 'http://localhost:8080/api';

export const api = {
  async login(email: string): Promise<{token: string, user: UserProfile}> {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async getProfile(): Promise<UserProfile> {
    const res = await fetch(`${BASE_URL}/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async updateProfile(user: UserProfile): Promise<UserProfile> {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!res.ok) throw new Error('Update failed');
    return res.json();
  }
};
