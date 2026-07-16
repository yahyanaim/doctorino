import { z } from "zod";
import {
  BOOKING_STATUS,
  DOCTOR_APPROVAL_STATUS,
  GENDERS,
} from "../../../domain/constants.js";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().max(30).optional(),
    gender: z.enum(GENDERS).optional(),
    bloodType: z.string().trim().max(5).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const createDoctorSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().max(30).optional(),
    photo: z.string().url().optional(),
    ticketPrice: z.number().nonnegative(),
    specialization: z.string().trim().min(2).max(120),
    bio: z.string().trim().max(160).optional(),
    about: z.string().trim().max(5000).optional(),
    qualifications: z.array(z.object({
      degree: z.string().min(1),
      university: z.string().optional(),
      year: z.number().int().min(1900).max(2200).optional(),
    })).optional(),
    experiences: z.array(z.object({
      position: z.string().min(1),
      hospital: z.string().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
    })).optional(),
    timeSlots: z.array(z.object({
      day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
      startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
      endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    })).optional(),
  }),
});

export const approvalSchema = z.object({
  body: z.object({
    approvalStatus: z.enum(Object.values(DOCTOR_APPROVAL_STATUS) as [string, ...string[]]),
  }),
});

export const createBookingSchema = z.object({
  body: z.object({
    doctorId: z.string().min(1),
    appointmentDate: z.coerce.date(),
    notes: z.string().trim().max(1000).optional(),
  }),
});

export const bookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(Object.values(BOOKING_STATUS) as [string, ...string[]]),
  }),
});

export const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1),
    reviewText: z.string().trim().min(3).max(2000),
    rating: z.number().int().min(1).max(5),
  }),
});
