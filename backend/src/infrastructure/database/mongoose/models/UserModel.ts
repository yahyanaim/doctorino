import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { GENDERS, USER_ROLES } from "../../../../domain/constants.js";

export interface IUserDocument extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  photo?: string;
  role: string;
  gender?: string;
  bloodType?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUserDocument>(
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
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    photo: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.PATIENT,
      index: true,
    },
    gender: {
      type: String,
      enum: GENDERS,
    },
    bloodType: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 5,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc: IUserDocument, ret: Record<string, unknown>) {
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.pre<IUserDocument>("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel: Model<IUserDocument> =
  mongoose.models.User ?? mongoose.model<IUserDocument>("User", userSchema);
