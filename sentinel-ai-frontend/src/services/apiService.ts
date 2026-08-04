
import { API_BASE_URL } from '../constants';
import { Server, Metric, Alert, FeedbackData, AuthResponse } from '../types';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const apiService = {
  async login(credentials: any): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  async getServers(): Promise<Server[]> {
    const response = await fetch(`${API_BASE_URL}/servers`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch servers');
    return response.json();
  },

  async addServer(serverData: Partial<Server>): Promise<Server> {
    const response = await fetch(`${API_BASE_URL}/servers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(serverData),
    });
    if (!response.ok) throw new Error('Failed to add server');
    return response.json();
  },

  async getLatestMetrics(): Promise<Metric[]> {
    const response = await fetch(`${API_BASE_URL}/metrics/latest`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch metrics');
    return response.json();
  },

  async getAlerts(): Promise<Alert[]> {
    const response = await fetch(`${API_BASE_URL}/alerts`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  },

  async resolveAlert(alertId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/alerts/resolve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ alertId }),
    });
    if (!response.ok) throw new Error('Failed to resolve alert');
  },

  async submitFeedback(feedback: FeedbackData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(feedback),
    });
    if (!response.ok) throw new Error('Failed to submit feedback');
  },
};
