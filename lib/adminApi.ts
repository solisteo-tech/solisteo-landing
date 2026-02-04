import api from './api';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  company_id?: string;
  company_name?: string;
  is_active: boolean;
  mfa_enabled?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Subscription {
  subscription_plan: string;
  max_users: number;
  current_users: number;
  users_remaining: number;
  status: string;
}

export interface UserListResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateUserPayload {
  email: string;
  password: string;
  full_name: string;
  role: string;
  company_id?: string;
  is_active?: boolean;
}

export interface UpdateUserPayload {
  email?: string;
  full_name?: string;
  role?: string;
  company_id?: string;
  is_active?: boolean;
}

export interface ListUsersParams {
  search?: string;
  role?: string;
  company_id?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export const adminApi = {
  // List users with pagination and filters
  listUsers: async (params: ListUsersParams = {}): Promise<UserListResponse> => {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.company_id) queryParams.append('company_id', params.company_id);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await api.get(`/api/v2/admin/users?${queryParams.toString()}`);
    return response.data;
  },

  // Create a new user
  createUser: async (payload: CreateUserPayload): Promise<User> => {
    const response = await api.post('/api/v2/admin/users', payload);
    return response.data;
  },

  // Get a specific user
  getUser: async (userId: string): Promise<User> => {
    const response = await api.get(`/api/v2/admin/users/${userId}`);
    return response.data;
  },

  // Update a user
  updateUser: async (userId: string, payload: UpdateUserPayload): Promise<User> => {
    const response = await api.put(`/api/v2/admin/users/${userId}`, payload);
    return response.data;
  },

  // Delete a user
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/api/v2/admin/users/${userId}`);
  },

  // Reset user password
  resetUserPassword: async (userId: string, newPassword: string): Promise<void> => {
    await api.post(`/api/v2/admin/users/${userId}/reset-password`, {
      new_password: newPassword
    });
  },

  // Send reset password link
  sendPasswordResetLink: async (userId: string): Promise<void> => {
    await api.post(`/api/v2/admin/users/${userId}/send-reset-email`);
  }
};

export const ownerApi = {
  // List company users
  listUsers: async (): Promise<User[]> => {
    const response = await api.get('/api/v2/owner/users');
    return response.data;
  },

  // Create user
  createUser: async (payload: any): Promise<User> => {
    const response = await api.post('/api/v2/owner/users', payload);
    return response.data;
  },

  // Update user
  updateUser: async (userId: string, payload: any): Promise<User> => {
    const response = await api.put(`/api/v2/owner/users/${userId}`, payload);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/api/v2/owner/users/${userId}`);
  },

  // Reset user password
  resetUserPassword: async (userId: string, newPassword: string): Promise<void> => {
    await api.post(`/api/v2/owner/users/${userId}/reset-password`, {
      new_password: newPassword
    });
  },

  // Reset MFA
  resetMfa: async (userId: string): Promise<void> => {
    await api.post(`/api/v2/owner/users/${userId}/reset-mfa`);
  },

  // Get subscription info
  getSubscription: async (): Promise<Subscription> => {
    const response = await api.get('/api/v2/owner/subscription');
    return response.data;
  }
};

export default adminApi;
