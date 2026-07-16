export const USER_ROLES = Object.freeze({
  PATIENT: "patient",
  ADMIN: "admin",
} as const);

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const AUTH_ACTOR_TYPES = Object.freeze({
  USER: "user",
  DOCTOR: "doctor",
} as const);

export type AuthActorType = (typeof AUTH_ACTOR_TYPES)[keyof typeof AUTH_ACTOR_TYPES];

export const DOCTOR_APPROVAL_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const);

export type DoctorApprovalStatus = (typeof DOCTOR_APPROVAL_STATUS)[keyof typeof DOCTOR_APPROVAL_STATUS];

export const BOOKING_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
} as const);

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const BOOKING_TRANSITIONS: Record<string, readonly string[]> = {
  [BOOKING_STATUS.PENDING]: [BOOKING_STATUS.APPROVED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.APPROVED]: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.CANCELLED]: [],
  [BOOKING_STATUS.COMPLETED]: [],
} as const;

export const GENDERS = Object.freeze(["male", "female", "other"] as const);

export type Gender = (typeof GENDERS)[number];
