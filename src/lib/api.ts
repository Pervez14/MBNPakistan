// src/lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach access token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    try {
      const authData = JSON.parse(localStorage.getItem('mbn-auth') || '{}');
      const token = authData?.state?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore invalid localStorage data
    }
  }

  return config;
});

// Response interceptor — handle 401/expired token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      try {
        if (typeof window === 'undefined') {
          return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_BASE}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        localStorage.setItem('refreshToken', newRefreshToken);

        const authData = JSON.parse(localStorage.getItem('mbn-auth') || '{}');

        if (authData?.state) {
          authData.state.accessToken = accessToken;
          localStorage.setItem('mbn-auth', JSON.stringify(authData));
        }

        original.headers.Authorization = `Bearer ${accessToken}`;

        return api(original);
      } catch {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('mbn-auth');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login?expired=true';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
};

// Bureau API
export const bureauAPI = {
  getMe: () => api.get('/bureau/me'),

  updateMe: (data: any) => api.put('/bureau/me', data),

  getDashboard: () => api.get('/bureau/dashboard'),

  getNotifications: () => api.get('/bureau/notifications'),

  markNotificationRead: (id: string) =>
    api.patch(`/bureau/notifications/${id}/read`),

  markAllNotificationsRead: () =>
    api.patch('/bureau/notifications/read-all'),
};

// Profile API
export const profileAPI = {
  create: (data: any) => api.post('/profiles', data),

  search: (params: any) => api.get('/profiles', { params }),

  getById: (id: string) => api.get(`/profiles/${id}`),

  update: (id: string, data: any) => api.put(`/profiles/${id}`, data),

  delete: (id: string) => api.delete(`/profiles/${id}`),

  getMine: (params?: any) => api.get('/profiles/mine', { params }),

  getMyProfiles: (page = 1, limit = 20) =>
    api.get('/profiles/mine', { params: { page, limit } }),

  revealContact: (id: string) => api.get(`/profiles/${id}/contact`),

  uploadPhotos: (id: string, formData: FormData) =>
    api.post(`/profiles/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deletePhoto: (profileId: string, photoId: string) =>
    api.delete(`/profiles/${profileId}/photos/${photoId}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/analytics'),

  listUsers: (params?: any) => api.get('/admin/users', { params }),

  getUserDetail: (id: string) => api.get(`/admin/users/${id}`),

  approveUser: (id: string) => api.put(`/admin/users/${id}/approve`),

  rejectUser: (id: string, reason: string) =>
    api.put(`/admin/users/${id}/reject`, { reason }),

  suspendUser: (id: string, reason: string) =>
    api.put(`/admin/users/${id}/suspend`, { reason }),

  reactivateUser: (id: string) =>
    api.put(`/admin/users/${id}/reactivate`),

  assignBadge: (id: string, badgeType: string, note?: string) =>
    api.post(`/admin/users/${id}/badges`, { badgeType, note }),

  removeBadge: (id: string, badgeType: string) =>
    api.delete(`/admin/users/${id}/badges/${badgeType}`),

  updateSubscription: (id: string, data: any) =>
    api.put(`/admin/users/${id}/subscription`, data),

  overrideContact: (id: string, override: boolean, note?: string) =>
    api.put(`/admin/users/${id}/override-contact`, { override, note }),

  getAnalytics: () => api.get('/admin/analytics'),

  getGrowthData: (months?: number) =>
    api.get('/admin/analytics/growth', { params: { months } }),

  getContactLogs: (params?: any) =>
    api.get('/admin/contact-logs', { params }),

  listProfiles: (params?: any) =>
    api.get('/admin/profiles', { params }),
};

// Notification API
export const notificationAPI = {
  getAll: (params?: any) => api.get('/notifications', { params }),

  markRead: (id: string) => api.put(`/notifications/${id}/read`),

  markAllRead: () => api.put('/notifications/read-all'),
};
