// User types
export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'PARTICIPANT'
  profile?: UserProfile | null
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: string
  userId: string
  company?: string | null
  jobTitle?: string | null
  phone?: string | null
  bio?: string | null
}

// Event types
export interface Event {
  id: string
  title: string
  description: string
  category: string
  startDate: Date
  endDate: Date
  location: string
  capacity: number
  registrationDeadline: Date
  status: 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  organizerId: string
  createdAt: Date
  updatedAt: Date
}

export interface CustomField {
  id: string
  eventId: string
  name: string
  type: 'TEXT' | 'EMAIL' | 'PHONE' | 'NUMBER' | 'DATE' | 'SELECT' | 'MULTI_SELECT' | 'TEXTAREA' | 'CHECKBOX'
  required: boolean
  options?: string | null
  order: number
}

// Registration types
export interface Registration {
  id: string
  eventId: string
  participantId: string
  status: 'REGISTERED' | 'CONFIRMED' | 'CANCELLED' | 'ATTENDED'
  registeredAt: Date
  checkedInAt?: Date | null
}

export interface RegistrationFieldValue {
  id: string
  registrationId: string
  fieldId: string
  value: string
}

// Form types
export interface EventFormData {
  title: string
  description: string
  category: string
  startDate: string
  endDate: string
  location: string
  capacity: string
  registrationDeadline: string
}

export interface RegistrationFormData {
  eventId: string
  participantId: string
  fieldValues: Record<string, string>
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Dashboard types
export interface DashboardStats {
  totalEvents: number
  totalRegistrations: number
  upcomingEvents: number
  completedEvents: number
}

export interface EventWithRegistrations extends Event {
  registrations: Registration[]
  _count: {
    registrations: number
  }
}
