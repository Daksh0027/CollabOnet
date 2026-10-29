import { connectToDatabase } from "./mongodb";
import { UserModel, IUser, UserRole, VerificationStatus } from "@/models/User";
import {
  VerificationTicketModel,
  IVerificationTicket,
  TicketStatus,
  IVerificationFormData,
} from "@/models/VerificationTicket";
import { hashPassword } from "./auth";

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  orgId?: string;
  branchId?: string;
  createdAt: string;
}

export interface StoredTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  role: string;
  status: TicketStatus;
  formData: IVerificationFormData;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

// Memory fallback cache for local dev / testing without live MongoDB
const memoryUsers: Map<string, StoredUser> = new Map();
const memoryTickets: Map<string, StoredTicket> = new Map();
let ticketCounter = 1001;

// Seed initial admin user in memory
async function seedDefaultUsers() {
  if (memoryUsers.size === 0) {
    const adminHash = await hashPassword("admin123");
    memoryUsers.set("admin@collabonet.com", {
      id: "usr_admin_001",
      email: "admin@collabonet.com",
      passwordHash: adminHash,
      name: "Platform Compliance Auditor",
      role: "PLATFORM_ADMIN",
      verificationStatus: "VERIFIED",
      createdAt: new Date().toISOString(),
    });
  }
}
seedDefaultUsers();

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const conn = await connectToDatabase();
  if (conn) {
    const doc = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    if (doc) {
      return {
        id: (doc as any)._id.toString(),
        email: doc.email,
        passwordHash: doc.passwordHash,
        name: doc.name,
        role: doc.role,
        verificationStatus: doc.verificationStatus,
        rejectionReason: doc.rejectionReason,
        orgId: doc.orgId,
        branchId: doc.branchId,
        createdAt: doc.createdAt.toISOString(),
      };
    }
    return null;
  }

  await seedDefaultUsers();
  return memoryUsers.get(email.toLowerCase()) || null;
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  const conn = await connectToDatabase();
  if (conn) {
    const doc = await UserModel.findById(id).lean();
    if (doc) {
      return {
        id: (doc as any)._id.toString(),
        email: doc.email,
        passwordHash: doc.passwordHash,
        name: doc.name,
        role: doc.role,
        verificationStatus: doc.verificationStatus,
        rejectionReason: doc.rejectionReason,
        orgId: doc.orgId,
        branchId: doc.branchId,
        createdAt: doc.createdAt.toISOString(),
      };
    }
    return null;
  }

  for (const user of memoryUsers.values()) {
    if (user.id === id) return user;
  }
  return null;
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
}): Promise<StoredUser> {
  const conn = await connectToDatabase();
  if (conn) {
    const doc = await UserModel.create({
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      name: data.name,
      role: data.role,
      verificationStatus: "UNVERIFIED",
    });
    return {
      id: doc._id.toString(),
      email: doc.email,
      passwordHash: doc.passwordHash,
      name: doc.name,
      role: doc.role,
      verificationStatus: doc.verificationStatus,
      createdAt: doc.createdAt.toISOString(),
    };
  }

  const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newUser: StoredUser = {
    id,
    email: data.email.toLowerCase(),
    passwordHash: data.passwordHash,
    name: data.name,
    role: data.role,
    verificationStatus: "UNVERIFIED",
    createdAt: new Date().toISOString(),
  };
  memoryUsers.set(newUser.email, newUser);
  return newUser;
}

export async function updateUserStatus(
  userId: string,
  status: VerificationStatus,
  rejectionReason?: string
): Promise<StoredUser | null> {
  const conn = await connectToDatabase();
  if (conn) {
    const doc = await UserModel.findByIdAndUpdate(
      userId,
      { verificationStatus: status, rejectionReason },
      { new: true }
    ).lean();
    if (doc) {
      return {
        id: (doc as any)._id.toString(),
        email: doc.email,
        passwordHash: doc.passwordHash,
        name: doc.name,
        role: doc.role,
        verificationStatus: doc.verificationStatus,
        rejectionReason: doc.rejectionReason,
        createdAt: doc.createdAt.toISOString(),
      };
    }
    return null;
  }

  for (const [key, user] of memoryUsers.entries()) {
    if (user.id === userId) {
      const updated = { ...user, verificationStatus: status, rejectionReason };
      memoryUsers.set(key, updated);
      return updated;
    }
  }
  return null;
}

export async function createVerificationTicket(data: {
  userId: string;
  userEmail: string;
  userName: string;
  role: string;
  formData: IVerificationFormData;
}): Promise<StoredTicket> {
  const ticketNumber = `TICK-${ticketCounter++}`;
  const conn = await connectToDatabase();

  if (conn) {
    const doc = await VerificationTicketModel.create({
      ticketNumber,
      userId: data.userId,
      userEmail: data.userEmail,
      userName: data.userName,
      role: data.role,
      status: "PENDING",
      formData: data.formData,
    });
    // Mark user as PENDING_REVIEW
    await UserModel.findByIdAndUpdate(data.userId, { verificationStatus: "PENDING_REVIEW" });

    return {
      id: doc._id.toString(),
      ticketNumber: doc.ticketNumber,
      userId: doc.userId,
      userEmail: doc.userEmail,
      userName: doc.userName,
      role: doc.role,
      status: doc.status,
      formData: doc.formData,
      createdAt: doc.createdAt.toISOString(),
    };
  }

  const id = `tck_${Date.now()}`;
  const ticket: StoredTicket = {
    id,
    ticketNumber,
    userId: data.userId,
    userEmail: data.userEmail,
    userName: data.userName,
    role: data.role,
    status: "PENDING",
    formData: data.formData,
    createdAt: new Date().toISOString(),
  };
  memoryTickets.set(id, ticket);

  // Update user in memory
  await updateUserStatus(data.userId, "PENDING_REVIEW");

  return ticket;
}

export async function findTicketByUserId(userId: string): Promise<StoredTicket | null> {
  const conn = await connectToDatabase();
  if (conn) {
    const doc = await VerificationTicketModel.findOne({ userId }).sort({ createdAt: -1 }).lean();
    if (doc) {
      return {
        id: (doc as any)._id.toString(),
        ticketNumber: doc.ticketNumber,
        userId: doc.userId,
        userEmail: doc.userEmail,
        userName: doc.userName,
        role: doc.role,
        status: doc.status,
        formData: doc.formData,
        adminNotes: doc.adminNotes,
        reviewedBy: doc.reviewedBy,
        reviewedAt: doc.reviewedAt?.toISOString(),
        createdAt: doc.createdAt.toISOString(),
      };
    }
    return null;
  }

  const list = Array.from(memoryTickets.values()).filter((t) => t.userId === userId);
  return list.length > 0 ? list[list.length - 1] : null;
}

export async function listVerificationTickets(filterStatus?: TicketStatus): Promise<StoredTicket[]> {
  const conn = await connectToDatabase();
  if (conn) {
    const query = filterStatus ? { status: filterStatus } : {};
    const docs = await VerificationTicketModel.find(query).sort({ createdAt: -1 }).lean();
    return docs.map((doc: any) => ({
      id: doc._id.toString(),
      ticketNumber: doc.ticketNumber,
      userId: doc.userId,
      userEmail: doc.userEmail,
      userName: doc.userName,
      role: doc.role,
      status: doc.status,
      formData: doc.formData,
      adminNotes: doc.adminNotes,
      reviewedBy: doc.reviewedBy,
      reviewedAt: doc.reviewedAt?.toISOString(),
      createdAt: doc.createdAt.toISOString(),
    }));
  }

  let tickets = Array.from(memoryTickets.values());
  if (filterStatus) {
    tickets = tickets.filter((t) => t.status === filterStatus);
  }
  return tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function resolveVerificationTicket(
  ticketId: string,
  decision: "APPROVED" | "REJECTED",
  adminNotes?: string,
  adminEmail: string = "admin@collabonet.com"
): Promise<StoredTicket | null> {
  const conn = await connectToDatabase();
  const reviewedAt = new Date();

  if (conn) {
    const doc = await VerificationTicketModel.findByIdAndUpdate(
      ticketId,
      {
        status: decision,
        adminNotes,
        reviewedBy: adminEmail,
        reviewedAt,
      },
      { new: true }
    );
    if (!doc) return null;

    // Update corresponding user
    const newStatus: VerificationStatus = decision === "APPROVED" ? "VERIFIED" : "REJECTED";
    await UserModel.findByIdAndUpdate(doc.userId, {
      verificationStatus: newStatus,
      rejectionReason: decision === "REJECTED" ? adminNotes : undefined,
    });

    return {
      id: doc._id.toString(),
      ticketNumber: doc.ticketNumber,
      userId: doc.userId,
      userEmail: doc.userEmail,
      userName: doc.userName,
      role: doc.role,
      status: doc.status,
      formData: doc.formData,
      adminNotes: doc.adminNotes,
      reviewedBy: doc.reviewedBy,
      reviewedAt: doc.reviewedAt?.toISOString(),
      createdAt: doc.createdAt.toISOString(),
    };
  }

  const ticket = memoryTickets.get(ticketId);
  if (!ticket) return null;

  ticket.status = decision;
  ticket.adminNotes = adminNotes;
  ticket.reviewedBy = adminEmail;
  ticket.reviewedAt = reviewedAt.toISOString();
  memoryTickets.set(ticketId, ticket);

  // Update user in memory
  const newStatus: VerificationStatus = decision === "APPROVED" ? "VERIFIED" : "REJECTED";
  await updateUserStatus(ticket.userId, newStatus, decision === "REJECTED" ? adminNotes : undefined);

  return ticket;
}
