import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "CREATOR" | "TALENT_MANAGER" | "SALES_REP" | "COMPANY_HEAD_ADMIN" | "PLATFORM_ADMIN";
export type VerificationStatus = "UNVERIFIED" | "PENDING_REVIEW" | "VERIFIED" | "REJECTED";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  orgId?: string;
  branchId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["CREATOR", "TALENT_MANAGER", "SALES_REP", "COMPANY_HEAD_ADMIN", "PLATFORM_ADMIN"],
      default: "CREATOR",
    },
    verificationStatus: {
      type: String,
      enum: ["UNVERIFIED", "PENDING_REVIEW", "VERIFIED", "REJECTED"],
      default: "UNVERIFIED",
    },
    rejectionReason: { type: String },
    orgId: { type: String },
    branchId: { type: String },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
