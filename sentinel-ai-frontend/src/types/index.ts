
export type Status = 'Healthy' | 'Warning' | 'Critical';
export type Severity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface Server {
  id: string;
  name: string;
  ip: string;
  status: Status;
  location: string;
}

export interface Metric {
  id: string;
  serverId: string;
  cpu: number;
  ram: number;
  disk: number;
  temperature: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  serverId: string;
  serverName: string;
  message: string;
  severity: Severity;
  timestamp: string;
  resolved: boolean;
}

export interface AuthResponse {
  token: string;
  user: {
    email: string;
    role: string;
  };
}

export interface FeedbackData {
  rating: number;
  comment: string;
}
