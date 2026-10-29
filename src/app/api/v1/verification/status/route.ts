import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { findUserById, findTicketByUserId } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ticket = await findTicketByUserId(user.id);

    return NextResponse.json({
      success: true,
      userVerificationStatus: user.verificationStatus,
      rejectionReason: user.rejectionReason,
      ticket: ticket
        ? {
            id: ticket.id,
            ticketNumber: ticket.ticketNumber,
            status: ticket.status,
            role: ticket.role,
            formData: ticket.formData,
            adminNotes: ticket.adminNotes,
            reviewedAt: ticket.reviewedAt,
            createdAt: ticket.createdAt,
          }
        : null,
    });
  } catch (error: any) {
    console.error("Verification status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
