import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { DOCTOR_APPROVAL_STATUS } from "../../../../domain/constants.js";

export interface IQualification {
  degree: string;
  university?: string;
  year?: number;
}

export interface IExperience {
  position: string;
  hospital?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ITimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface IDoctorDocument extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  photo?: string;
  ticketPrice: number;
  specialization: string;
  qualifications: IQualification[];
  experiences: IExperience[];
  bio?: string;
  about?: string;
  timeSlots: ITimeSlot[];
  averageRating: number;
  totalReviews: number;
  approvalStatus: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const qualificationSchema = new mongoose.Schema<IQualification>(
  {
    degree: { type: String, required: true, trim: true },
    university: { type: String, trim: true },
    year: { type: Number, min: 1900, max: 2200 },
  },
  { _id: false },
);

const experienceSchema = new mongoose.Schema<IExperience>(
  {
    position: { type: String, required: true, trim: true },
    hospital: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { _id: false },
);

const timeSlotSchema = new mongoose.Schema<ITimeSlot>(
  {
    day: {
      type: String,
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      required: true,
    },
    startTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    endTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  },
  { _id: false },
);

const doctorSchema = new mongoose.Schema<IDoctorDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 30 },
    photo: { type: String, trim: true },
    ticketPrice: { type: Number, required: true, min: 0 },
    specialization: { type: String, required: true, trim: true, index: true },
    qualifications: { type: [qualificationSchema], default: [] },
    experiences: { type: [experienceSchema], default: [] },
    bio: { type: String, trim: true, maxlength: 160 },
    about: { type: String, trim: true, maxlength: 5000 },
    timeSlots: { type: [timeSlotSchema], default: [] },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
    approvalStatus: {
      type: String,
      enum: Object.values(DOCTOR_APPROVAL_STATUS),
      default: DOCTOR_APPROVAL_STATUS.PENDING,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc: IDoctorDocument, ret: Record<string, unknown>) {
        delete ret.password;
        return ret;
      },
    },
  },
);

doctorSchema.index({
  name: "text",
  specialization: "text",
  bio: "text",
  about: "text",
});

doctorSchema.pre<IDoctorDocument>("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

doctorSchema.methods.comparePassword = function comparePassword(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const DoctorModel: Model<IDoctorDocument> =
  mongoose.models.Doctor ?? mongoose.model<IDoctorDocument>("Doctor", doctorSchema);
