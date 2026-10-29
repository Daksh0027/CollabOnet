import mongoose, { Schema, Document, Model } from "mongoose";

export type TicketStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IVerificationFormData {
  // Creator specific fields
  primaryPlatform?: string;
  handle?: string;
  profileUrl?: string;
  niche?: string[];
  followerCount?: number;
  avgViews?: number;
  baseRate?: number;
  proofUrl?: string;

  // Talent Manager fields
  agencyName?: string;
  agencyWebsite?: string;
  rosterSize?: number;
  representationDocUrl?: string;

  // Brand Sponsor fields
  companyName?: string;
  officialWebsite?: string;
  workEmail?: string;
  registrationNumber?: string;
  campaignBudgetRange?: string;
}

export interface IVerificationTicket extends Document {
  ticketNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  role: string;
  status: TicketStatus;
  formData: IVerificationFormData;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationTicketSchema = new Schema<IVerificationTicket>(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    role: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    formData: { type: Schema.Types.Mixed, required: true },
    adminNotes: { type: String },
    reviewedBy: { type: String },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export const VerificationTicketModel: Model<IVerificationTicket> =
  mongoose.models.VerificationTicket ||
  mongoose.model<IVerificationTicket>("VerificationTicket", VerificationTicketSchema);
