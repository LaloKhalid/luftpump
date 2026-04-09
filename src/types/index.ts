export type LeadStatus = "NEW" | "CONTACTED" | "BOOKED" | "COMPLETED" | "LOST";
export type BookingType = "CONSULTATION" | "INSTALLATION";
export type JobStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type UserRole = "ADMIN" | "TECHNICIAN";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  houseSize: number;
  floors: number;
  heatingSystem: string;
  message?: string | null;
  imageUrl?: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  bookings?: Booking[];
}

export interface Booking {
  id: number;
  leadId: number;
  date: string;
  time: string;
  type: BookingType;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  lead?: Lead;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  jobs?: Job[];
}

export interface Job {
  id: number;
  customerId: number;
  bookingId?: number | null;
  technician?: string | null;
  status: JobStatus;
  scheduledDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  booking?: Booking;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  totalBookings: number;
  totalJobs: number;
  completedJobs: number;
  conversionRate: number;
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Ny",
  CONTACTED: "Kontaktad",
  BOOKED: "Bokad",
  COMPLETED: "Klar",
  LOST: "Förlorad",
};

export const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
  CONSULTATION: "Konsultation",
  INSTALLATION: "Installation",
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  PENDING: "Väntar",
  IN_PROGRESS: "Pågår",
  COMPLETED: "Klar",
  CANCELLED: "Avbruten",
};

export const HEATING_SYSTEMS = [
  "Direktverkande el",
  "Oljepanna",
  "Gaspanna",
  "Fjärrvärme",
  "Pelletspanna",
  "Bergvärme",
  "Luftvärmepump (befintlig)",
  "Annat",
] as const;
