import axios from 'axios';
import { getToken, clearToken } from './security';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Validate API URL (only if provided)
if (API_BASE_URL && !API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
  console.error('Invalid API_BASE_URL: must start with http:// or https://');
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 120 second timeout to accommodate scraping operations
  withCredentials: false, // Set to true if using httpOnly cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const token = getToken();  // Use secure token getter
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh or logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle redirects on client side
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        // Token expired or invalid - clear and redirect
        clearToken();  // Use secure token clearer

        // Avoid redirect loop by checking current path
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?reason=session_expired';
        }
      } else if (error.response?.status === 403) {
        // Forbidden - insufficient permissions
        console.error('Access denied: insufficient permissions');
      } else if (error.response?.status === 429) {
        // Rate limit exceeded
        console.error('Rate limit exceeded. Please try again later.');
      }
    }
    return Promise.reject(error);
  }
);

// Dashboard API endpoints
export const dashboardAPI = {
  // Get dashboard KPIs
  getDashboardKPIs: () => api.get('/api/v1/seller/dashboard/kpis'),

  // Get sales chart data
  getSalesChartData: () => api.get('/api/v1/seller/dashboard/sales-chart'),

  // Get inventory chart data
  getInventoryChartData: () => api.get('/api/v1/seller/dashboard/inventory-chart'),

  // Get top products
  getTopProducts: () => api.get('/api/v1/seller/dashboard/top-products'),

  // Get alerts
  getAlerts: () => api.get('/api/v1/seller/dashboard/alerts'),
};

// Admin API endpoints
export const adminAPI = {
  // Get all sellers
  getSellers: () => api.get('/api/v1/admin/sellers'),

  // Get seller details
  getSellerDetails: (sellerId: string) => api.get(`/api/v1/admin/sellers/${sellerId}`),

  // Update seller
  updateSeller: (sellerId: string, data: any) => api.put(`/api/v1/admin/sellers/${sellerId}`, data),

  // Delete seller
  deleteSeller: (sellerId: string) => api.delete(`/api/v1/admin/sellers/${sellerId}`),

  // Get audit logs
  getAuditLogs: (params?: { page?: number; limit?: number; seller_id?: string }) =>
    api.get('/api/v1/admin/audit-logs', { params }),

  // Get all alerts
  getAlerts: () => api.get('/api/v1/admin/alerts'),

  // Get system stats
  getSystemStats: () => api.get('/api/v1/admin/system-stats'),

  // Get subscription plans
  getPlans: () => api.get('/api/v1/admin/subscription-plans'),

  // Get admin settings
  getSettings: () => api.get('/api/v1/admin/settings'),
  // Update admin settings
  updateSettings: (data: any) => api.put('/api/v1/admin/settings', data),

  // Alert management
  acknowledgeAlert: (alertId: number) => api.patch(`/api/v1/admin/alerts/${alertId}/acknowledge`),
  resolveAlert: (alertId: number) => api.patch(`/api/v1/admin/alerts/${alertId}/resolve`),
  generateTestAlerts: () => api.post('/api/v1/admin/alerts/generate-test'),
};

// Auth API endpoints
export const authAPI = {
  // Legacy Email 2FA (deprecated but kept for compatibility)
  enableMfa: (enable: boolean) => api.post('/api/v1/auth/mfa/enable', { enable }),
  verifyMfa: (data: { code: string }) => api.post('/api/v1/auth/mfa/verify', data),
  resendOtp: () => api.post('/api/v1/auth/mfa/resend'),

  // New TOTP Auth
  verifyTotp: (data: { mfa_token: string; code: string }) => api.post('/api/v2/auth/verify-totp', data),
};

// Owner Management API
export const ownerApi = {
  listUsers: () => api.get('/api/v2/owner/users').then(res => res.data),
  createUser: (data: any) => api.post('/api/v2/owner/users', data).then(res => res.data),
  updateUser: (userId: string, data: any) => api.put(`/api/v2/owner/users/${userId}`, data).then(res => res.data),
  deleteUser: (userId: string) => api.delete(`/api/v2/owner/users/${userId}`).then(res => res.data),
  resetUserPassword: (userId: string, new_password: string) => api.post(`/api/v2/owner/users/${userId}/reset-password`, { new_password }).then(res => res.data),
  getSubscription: () => api.get('/api/v2/owner/subscription').then(res => res.data),
};

// Billing API endpoints
export const billingAPI = {
  // Get seller usage and plan information
  getSellerUsage: () => api.get('/api/v1/billing/usage'),

  // Create checkout session
  createCheckoutSession: (data: any) => api.post('/api/v1/billing/create-session', data),

  // Admin billing stats
  getBillingStats: () => api.get('/api/v1/billing/admin/stats'),

  // Admin sellers billing info
  getSellersBilling: () => api.get('/api/v1/billing/admin/sellers'),

  // Update seller plan (admin)
  updateSellerPlan: (sellerId: string, planId: string) =>
    api.put(`/api/v1/billing/admin/sellers/${sellerId}/plan`, { plan_id: planId }),
};

// Support API endpoints
export const supportAPI = {
  // Seller
  createTicket: (data: any) => api.post('/api/v1/support/tickets', data),
  listMyTickets: (params?: { status?: string }) => api.get('/api/v1/support/tickets', { params }),
  getTicket: (ticketId: string, params?: { limit?: number; offset?: number }) =>
    api.get(`/api/v1/support/tickets/${ticketId}`, { params }),
  sendMessage: (ticketId: string, data: any) => api.post(`/api/v1/support/tickets/${ticketId}/message`, data),

  // Typing indicators
  setTyping: (ticketId: string, is_typing: boolean) =>
    api.post(`/api/v1/support/tickets/${ticketId}/typing`, { is_typing }),
  getTyping: (ticketId: string) => api.get(`/api/v1/support/tickets/${ticketId}/typing`),

  // File upload
  uploadFile: (ticketId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/api/v1/support/tickets/${ticketId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  downloadFile: (filename: string) => api.get(`/api/v1/support/files/${filename}`, { responseType: 'blob' }),

  // Read status
  markRead: (ticketId: string, message_ids?: string[]) =>
    api.post(`/api/v1/support/tickets/${ticketId}/mark-read`, { message_ids }),

  // Seen status (new)
  markSeen: (ticketId: string, message_ids?: string[]) =>
    api.post(`/api/v1/support/tickets/${ticketId}/mark-seen`, { message_ids }),

  // Presence/heartbeat (new)
  heartbeat: () => api.post('/api/v1/support/heartbeat'),
  getPresence: (userId: string) => api.get(`/api/v1/support/presence/${userId}`),

  // Admin
  listAllTickets: (params?: { status?: string; priority?: string; category?: string; q?: string }) =>
    api.get('/api/v1/support/admin/tickets', { params }),
  getTicketAdmin: (ticketId: string, params?: { limit?: number; offset?: number; include_internal?: boolean }) =>
    api.get(`/api/v1/support/admin/tickets/${ticketId}`, { params }),
  replyTicketAdmin: (ticketId: string, data: any) => api.post(`/api/v1/support/admin/tickets/${ticketId}/reply`, data),
  updateStatus: (ticketId: string, data: { status: string }) => api.patch(`/api/v1/support/admin/tickets/${ticketId}/status`, data),
  updatePriority: (ticketId: string, data: { priority: string }) => api.patch(`/api/v1/support/admin/tickets/${ticketId}/priority`, data),

  // Admin stats (new)
  getStats: () => api.get('/api/v1/support/admin/stats'),
};

export default api;
