export interface AuthState {
  refreshToken: string | null;
  refreshExpireAt: number | null;
  expiresAt: number | null;
  user: User | null;
  reportSetting: ReportSetting | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  profilePicture: string;
}

export interface ReportSetting {
  userId: string;
  frequency?: string;
  isEnabled: boolean;
}

