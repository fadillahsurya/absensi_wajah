
export type AttendanceStatus = 'NONE' | 'CLOCK_IN' | 'CLOCK_OUT';

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  faceRegistered: boolean;
  faceData?: string;
  baseSalary: number;
  gender: 'Laki-laki' | 'Perempuan';
  email: string;
  phone: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'LEAVE';
  lat?: number;
  lng?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface PayrollSummary {
  totalOvertimeHours: number;
  totalClaims: number;
  estimatedTakeHomePay: number;
}
